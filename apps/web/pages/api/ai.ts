import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Check if local models are enabled
    const useLocalModels = process.env.ALLOW_LOCAL_MODELS === 'true';
    const baseUrl = useLocalModels
      ? process.env.LOCAL_OPENAI_BASE_URL || 'http://localhost:11434/v1'
      : 'https://api.openai.com/v1';

    // Get API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey && !useLocalModels) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Prepare the request to OpenAI or local model
    const requestBody = {
      model: useLocalModels ? 'codellama' : 'gpt-4o-mini',
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        ...messages,
      ],
      temperature: 0.2,
      stream: true,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!useLocalModels) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    // Set up SSE headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // Stream the response
    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: 'Failed to read response' });
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            res.write(`${line}\\n`);
          }
        }
      }
    } catch (streamError) {
      console.error('Streaming error:', streamError);
    } finally {
      res.write('data: [DONE]\\n\\n');
      res.end();
    }
  } catch (error) {
    console.error('AI handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
