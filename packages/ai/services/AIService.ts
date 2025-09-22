// AI Service abstraction layer for multiple providers
export interface AIMessage {
  role: "user" | "assistant" | "system";
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

export interface AIProvider {
  name: string;
  models: string[];
  supportsStreaming: boolean;
  maxTokens: number;
}

export interface AIServiceConfig {
  provider: "openai" | "anthropic" | "local" | "ollama";
  apiKey?: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export abstract class AIService {
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  abstract generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse>;

  abstract generateStreamResponse(
    messages: AIMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse>;

  abstract getAvailableModels(): Promise<string[]>;

  abstract validateConnection(): Promise<boolean>;

  // Helper method to format context for AI
  protected formatCodeContext(
    code: string,
    fileName?: string,
    language?: string,
    cursorPosition?: { line: number; column: number }
  ): string {
    let context = "";

    if (fileName) {
      context += `File: ${fileName}\n`;
    }

    if (language) {
      context += `Language: ${language}\n`;
    }

    if (cursorPosition) {
      context += `Cursor Position: Line ${cursorPosition.line}, Column ${cursorPosition.column}\n`;
    }

    context += `\nCode:\n\`\`\`${language || "text"}\n${code}\n\`\`\`\n`;

    return context;
  }

  // Helper method to create specialized prompts
  protected createSystemPrompt(
    intent: "explain" | "generate" | "debug" | "optimize" | "test" | "chat"
  ): string {
    const basePrompt = `You are an expert programming assistant integrated into a collaborative development platform. You help developers with code analysis, generation, debugging, and optimization.

Current context: You're working in a real-time collaborative editor where multiple developers might be working together.

Guidelines:
- Provide clear, concise, and actionable responses
- Include code examples when helpful
- Explain your reasoning
- Consider best practices and modern development standards
- Be aware this is a collaborative environment`;

    const intentSpecificPrompts = {
      explain: `\n\nSpecialization: Code Explanation
- Break down complex code into understandable parts
- Explain the purpose, logic, and flow
- Identify patterns, algorithms, and design principles
- Highlight potential issues or improvements`,

      generate: `\n\nSpecialization: Code Generation
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
