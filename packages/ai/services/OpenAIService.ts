/* global TextDecoder, TextEncoder */
/* eslint-disable no-constant-condition */
import { AIService, AIMessage, AIResponse, AIServiceConfig } from './AIService';

export class OpenAIService extends AIService {
  private baseUrl: string;

  constructor(config: AIServiceConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const requestMessages = [
      ...(systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }]
        : []),
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: requestMessages,
          max_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}${errorData ? ` - ${errorData.error?.message}` : ''}`
        );
      }

      const data = await response.json();

      return {
        content: data.choices[0]?.message?.content || 'No response generated',
        usage: data.usage,
        model: data.model,
        finish_reason: data.choices[0]?.finish_reason,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateStreamResponse(
    messages: AIMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const requestMessages = [
      ...(systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }]
        : []),
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: requestMessages,
          max_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}${errorData ? ` - ${errorData.error?.message}` : ''}`
        );
      }

      let fullContent = '';
      let usage = undefined;
      let model = undefined;
      let finishReason = undefined;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta;

              if (delta?.content) {
                fullContent += delta.content;
                onChunk?.(delta.content);
              }

              if (parsed.usage) {
                usage = parsed.usage;
              }

              if (parsed.model) {
                model = parsed.model;
              }

              if (parsed.choices[0]?.finish_reason) {
                finishReason = parsed.choices[0].finish_reason;
              }
            } catch (e) {
              // Ignore JSON parse errors for malformed chunks
            }
          }
        }
      }

      return {
        content: fullContent,
        usage,
        model,
        finish_reason: finishReason,
      };
    } catch (error) {
      console.error('OpenAI Streaming API error:', error);
      throw error;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.config.apiKey) {
      return ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data
        .filter((model: any) => model.id.includes('gpt'))
        .map((model: any) => model.id)
        .sort();
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      // Return default models if API call fails
      return ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'];
    }
  }

  async validateConnection(): Promise<boolean> {
    if (!this.config.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('OpenAI connection validation failed:', error);
      return false;
    }
  }
}
