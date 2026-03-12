export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  finish_reason?: string;
}

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export abstract class AIService {
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    if (new.target === AIService) {
      throw new Error('AIService is abstract and cannot be instantiated directly');
    }
    this.config = config;
  }

  // Default: throw unless implemented
  generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    throw new Error('generateResponse must be implemented by subclass');
  }
  generateStreamResponse(
    messages: AIMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    throw new Error('generateStreamResponse must be implemented by subclass');
  }
  getAvailableModels(): Promise<string[]> {
    throw new Error('getAvailableModels must be implemented by subclass');
  }
  validateConnection(): Promise<boolean> {
    throw new Error('validateConnection must be implemented by subclass');
  }
}
