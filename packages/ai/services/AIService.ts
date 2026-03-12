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
