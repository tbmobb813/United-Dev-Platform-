/* global TextDecoder */

import { AIService, AIMessage, AIResponse, AIServiceConfig } from './AIService';

export class AnthropicService extends AIService {
  private baseUrl: string;

  constructor(config: AIServiceConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    // Anthropic uses a different message format
    const anthropicMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.7,
          system: systemPrompt,
          messages: anthropicMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Anthropic API error: ${response.status} ${response.statusText}${
            errorData ? ` - ${errorData.error?.message}` : ''
          }`
        );
      }

      const data = await response.json();

      return {
        content: data.content[0]?.text || 'No response generated',
        usage: data.usage
          ? {
              prompt_tokens: data.usage.input_tokens,
              completion_tokens: data.usage.output_tokens,
              total_tokens: data.usage.input_tokens + data.usage.output_tokens,
            }
          : undefined,
        model: data.model,
        finish_reason: data.stop_reason,
      };
    } catch {
      throw new Error('Anthropic API error');
    }
  }

  async generateStreamResponse(
    messages: AIMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    const anthropicMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.7,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Anthropic API error: ${response.status} ${response.statusText}${
            errorData ? ` - ${errorData.error?.message}` : ''
          }`
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

      let finished = false;
      while (!finished) {
        const { done, value } = await reader.read();
        if (done) {
          finished = true;
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

              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                fullContent += parsed.delta.text;
                onChunk?.(parsed.delta.text);
              }

              if (parsed.type === 'message_start' && parsed.message) {
                model = parsed.message.model;
                usage = parsed.message.usage;
              }

              if (
                parsed.type === 'message_delta' &&
                parsed.delta?.stop_reason
              ) {
                finishReason = parsed.delta.stop_reason;
              }

              if (parsed.type === 'message_delta' && parsed.usage) {
                usage = {
                  prompt_tokens: parsed.usage.input_tokens,
                  completion_tokens: parsed.usage.output_tokens,
                  total_tokens:
                    parsed.usage.input_tokens + parsed.usage.output_tokens,
                };
              }
            } catch {
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
    } catch {
      throw new Error('Anthropic Streaming API error');
    }
  }

  async getAvailableModels(): Promise<string[]> {
    // Anthropic doesn't have a public models endpoint, so return known models
    return [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-2.1',
      'claude-2.0',
      'claude-instant-1.2',
    ];
  }

  async validateConnection(): Promise<boolean> {
    if (!this.config.apiKey) {
      return false;
    }

    try {
      // Test with a minimal request
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
