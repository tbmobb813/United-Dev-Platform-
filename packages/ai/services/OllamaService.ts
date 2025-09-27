import { AIMessage, AIResponse, AIService, AIServiceConfig } from './AIService';

interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

interface OllamaStreamResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaService extends AIService {
  private baseUrl: string;

  constructor(config: AIServiceConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      return response.ok;
    } catch {
      // Ollama connection failed - offline mode
      return false;
    }
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    try {
      const ollamaMessages = this.convertMessages(messages, systemPrompt);

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: this.config.temperature || 0.7,
            num_predict: this.config.maxTokens || 1500,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data: OllamaResponse = await response.json();

      return {
        content: data.message.content,
        usage: {
          prompt_tokens: 0, // Ollama doesn't provide token counts
          completion_tokens: 0,
          total_tokens: 0,
        },
        model: data.model,
        finish_reason: 'stop',
      };
    } catch (error) {
      throw new Error(
        `Ollama generation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async generateStreamResponse(
    messages: AIMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const ollamaMessages = this.convertMessages(messages, systemPrompt);

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: ollamaMessages,
          stream: true,
          options: {
            temperature: this.config.temperature || 0.7,
            num_predict: this.config.maxTokens || 1500,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      let fullContent = '';
      let lastResponse: OllamaStreamResponse | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = new (globalThis as any).TextDecoder();

      try {
        let finished = false;
        while (!finished) {
          const { done, value } = await reader.read();
          if (done) {
            finished = true;
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line: string) => line.trim());

          for (const line of lines) {
            try {
              const data: OllamaStreamResponse = JSON.parse(line);
              const content = data.message?.content || '';

              if (content) {
                fullContent += content;
                onChunk?.(content);
              }

              lastResponse = data;

              if (data.done) {
                finished = true;
                break;
              }
            } catch {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        content: fullContent,
        usage: {
          prompt_tokens: 0, // Ollama doesn't provide token counts
          completion_tokens: 0,
          total_tokens: 0,
        },
        model: lastResponse?.model || this.config.model,
        finish_reason: 'stop',
      };
    } catch (error) {
      throw new Error(
        `Ollama streaming failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.models?.map((model: { name: string }) => model.name) || [];
    } catch {
      // Silent fail - return common models
      return [
        'llama2',
        'codellama',
        'mistral',
        'neural-chat',
        'starling-lm',
        'llama2-uncensored',
        'deepseek-coder',
      ];
    }
  }

  private convertMessages(
    messages: AIMessage[],
    systemPrompt?: string
  ): OllamaMessage[] {
    const ollamaMessages: OllamaMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      ollamaMessages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    // Convert messages
    for (const message of messages) {
      ollamaMessages.push({
        role: message.role === 'user' ? 'user' : 'assistant',
        content: message.content,
      });
    }

    return ollamaMessages;
  }

  // Ollama-specific utility methods
  async pullModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.status}`);
      }

      // This is a streaming response, but for simplicity we'll just wait for completion
      const reader = response.body?.getReader();
      if (reader) {
        try {
          let finished = false;
          while (!finished) {
            const { done } = await reader.read();
            if (done) {
              finished = true;
              break;
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to pull model ${modelName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.status}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to delete model ${modelName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getModelInfo(modelName: string): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get model info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        `Failed to get model info for ${modelName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
