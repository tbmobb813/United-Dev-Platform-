import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@udp/db';
import logger from '@udp/logger';

/* global TextDecoder */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
  const { messages, system, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Verify session exists if provided
    let session = null;
    if (sessionId) {
      session = await prisma.aiChatSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        return res.status(400).json({ error: 'Session not found' });
      }
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

    // Store the user message if session exists
    if (session && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        await prisma.aiMessage.create({
          data: {
            sessionId,
            role: 'USER',
            content: lastMessage.content,
          },
        });
      }
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
      logger.error('AI API error:', error);
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

    // Stream the response and collect assistant message
    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: 'Failed to read response' });
    }

    const decoder = new TextDecoder();
    let assistantContent = '';

    try {
      // intentional streaming read loop
       
      while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // Extract content for database storage
            if (line !== 'data: [DONE]' && session) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                }
              } catch {
                // Ignore JSON parse errors for non-JSON lines
              }
            }

            res.write(`${line}\n`);
          }
        }
      }
    } catch (streamError) {
      logger.error('Streaming error:', streamError);
    } finally {
      res.write('data: [DONE]\n\n');

      // Store the complete assistant response
      if (session && assistantContent) {
        try {
          await prisma.aiMessage.create({
            data: {
              sessionId,
              role: 'ASSISTANT',
              content: assistantContent,
              metadata: {
                model: requestBody.model,
                temperature: requestBody.temperature,
                useLocalModels,
              },
            },
          });

          // Update session timestamp
          await prisma.aiChatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          });
        } catch (dbError) {
          logger.error('Error storing AI message:', dbError);
        }
      }

      res.end();
    }
    } catch (error) {
      logger.error('AI handler error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}
