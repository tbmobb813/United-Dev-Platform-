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
- Write clean, maintainable, and efficient code
- Follow language-specific best practices
- Include proper error handling where appropriate
- Add helpful comments for complex logic`,

      debug: `\n\nSpecialization: Debugging
- Identify potential bugs and issues
- Suggest fixes with explanations
- Consider edge cases and error scenarios
- Provide step-by-step debugging approaches`,

      optimize: `\n\nSpecialization: Code Optimization
- Identify performance bottlenecks
- Suggest algorithmic improvements
- Consider memory usage and efficiency
- Maintain code readability while optimizing`,

      test: `\n\nSpecialization: Test Generation
- Create comprehensive test cases
- Include unit tests, integration tests, and edge cases
- Use appropriate testing frameworks and patterns
- Focus on test coverage and reliability`,

      chat: `\n\nSpecialization: General Development Chat
- Answer development questions conversationally
- Provide guidance on architecture and design decisions
- Help with technology choices and best practices
- Assist with debugging and problem-solving`,
    };

    return (
      basePrompt + (intentSpecificPrompts[intent] || intentSpecificPrompts.chat)
    );
  }
}
