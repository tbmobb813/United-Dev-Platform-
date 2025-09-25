import {
  AIService,
  AIMessage,
  AIResponse,
  AIServiceConfig,
} from './services/AIService';
import { AIServiceFactory, DEFAULT_CONFIGS } from './services/AIServiceFactory';

export interface CodeContext {
  fileName?: string;
  language?: string;
  selectedCode?: string;
  fullCode?: string;
  cursorPosition?: { line: number; column: number };
  projectContext?: string;
}

export interface AIManagerConfig {
  defaultProvider: 'openai' | 'anthropic';
  apiKeys: {
    openai?: string;
    anthropic?: string;
  };
  defaultModel?: string;
  enableStreaming?: boolean;
}

export class AIManager {
  private service: AIService | null = null;
  private config: AIManagerConfig;
  private isInitialized = false;

  constructor(config: AIManagerConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const apiKey = this.config.apiKeys[this.config.defaultProvider];
    if (!apiKey) {
      throw new Error(`API key for ${this.config.defaultProvider} is required`);
    }

    const serviceConfig: AIServiceConfig = {
      provider: this.config.defaultProvider,
      apiKey,
      model:
        this.config.defaultModel ||
        (this.config.defaultProvider === 'openai'
          ? DEFAULT_CONFIGS.development.model
          : 'claude-3-sonnet-20240229'),
      stream: this.config.enableStreaming ?? true,
    };

    this.service = AIServiceFactory.createService(serviceConfig);

    // Validate connection
    const isValid = await this.service.validateConnection();
    if (!isValid) {
      throw new Error(
        `Failed to connect to ${this.config.defaultProvider} API`
      );
    }

    this.isInitialized = true;
  }

  async chat(
    message: string,
    context?: CodeContext,
    intent:
      | 'explain'
      | 'generate'
      | 'debug'
      | 'optimize'
      | 'test'
      | 'chat' = 'chat',
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.service) {
      throw new Error('AI Manager not initialized. Call initialize() first.');
    }

    const systemPrompt = this.createSystemPrompt(intent, context);
    const messages: AIMessage[] = [
      {
        role: 'user',
        content: this.formatUserMessage(message, context),
        timestamp: new Date(),
      },
    ];

    if (onChunk && this.config.enableStreaming) {
      return await this.service.generateStreamResponse(
        messages,
        systemPrompt,
        onChunk
      );
    } else {
      return await this.service.generateResponse(messages, systemPrompt);
    }
  }

  async explainCode(
    code: string,
    context?: Omit<CodeContext, 'selectedCode'>
  ): Promise<AIResponse> {
    const fullContext: CodeContext = { ...context, selectedCode: code };
    return this.chat(
      `Please explain this code in detail:`,
      fullContext,
      'explain'
    );
  }

  async generateCode(
    prompt: string,
    context?: CodeContext,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    return this.chat(
      `Generate code for: ${prompt}`,
      context,
      'generate',
      onChunk
    );
  }

  async debugCode(
    code: string,
    errorMessage?: string,
    context?: Omit<CodeContext, 'selectedCode'>
  ): Promise<AIResponse> {
    const fullContext: CodeContext = { ...context, selectedCode: code };
    const message = errorMessage
      ? `Debug this code that's causing this error: "${errorMessage}"`
      : `Debug this code and identify potential issues:`;

    return this.chat(message, fullContext, 'debug');
  }

  async optimizeCode(
    code: string,
    context?: Omit<CodeContext, 'selectedCode'>
  ): Promise<AIResponse> {
    const fullContext: CodeContext = { ...context, selectedCode: code };
    return this.chat(
      `Optimize this code for better performance and maintainability:`,
      fullContext,
      'optimize'
    );
  }

  async generateTests(
    code: string,
    context?: Omit<CodeContext, 'selectedCode'>
  ): Promise<AIResponse> {
    const fullContext: CodeContext = { ...context, selectedCode: code };
    return this.chat(
      `Generate comprehensive unit tests for this code:`,
      fullContext,
      'test'
    );
  }

  private createSystemPrompt(intent: string, context?: CodeContext): string {
    let basePrompt = `You are an expert programming assistant integrated into a collaborative development platform called United Development Platform (UDP). You help developers with code analysis, generation, debugging, and optimization.

Current context: You're working in a real-time collaborative editor where multiple developers might be working together.`;

    if (context?.fileName) {
      basePrompt += `\nCurrent file: ${context.fileName}`;
    }

    if (context?.language) {
      basePrompt += `\nProgramming language: ${context.language}`;
    }

    if (context?.projectContext) {
      basePrompt += `\nProject context: ${context.projectContext}`;
    }

    const intentPrompts = {
      explain: `\n\nYour task: Explain code clearly and comprehensively
- Break down complex logic into understandable parts
- Explain the purpose, flow, and key concepts
- Identify patterns, algorithms, and design principles used
- Point out potential issues or areas for improvement
- Use clear, educational language`,

      generate: `\n\nYour task: Generate high-quality code
- Write clean, readable, and maintainable code
- Follow language-specific best practices and conventions
- Include proper error handling where appropriate
- Add helpful comments for complex logic
- Consider performance and security implications`,

      debug: `\n\nYour task: Debug and troubleshoot code
- Identify bugs, logical errors, and potential issues
- Explain why problems occur and their impact
- Provide specific fixes with clear explanations
- Consider edge cases and error scenarios
- Suggest preventive measures for similar issues`,

      optimize: `\n\nYour task: Optimize code for better performance
- Identify performance bottlenecks and inefficiencies
- Suggest algorithmic improvements
- Consider memory usage and computational complexity
- Maintain code readability while optimizing
- Explain the trade-offs of each optimization`,

      test: `\n\nYour task: Generate comprehensive tests
- Create unit tests that cover main functionality
- Include edge cases and error scenarios
- Use appropriate testing frameworks and patterns
- Focus on test coverage and reliability
- Write clear test descriptions and assertions`,

      chat: `\n\nYour task: Assist with general development questions
- Provide helpful, accurate, and actionable advice
- Consider the collaborative development context
- Help with architecture and design decisions
- Assist with technology choices and best practices`,
    };

    return (
      basePrompt +
      (intentPrompts[intent as keyof typeof intentPrompts] ||
        intentPrompts.chat)
    );
  }

  private formatUserMessage(message: string, context?: CodeContext): string {
    let formattedMessage = message;

    if (context) {
      if (context.selectedCode) {
        formattedMessage += `\n\n**Selected Code:**\n\`\`\`${
          context.language || 'text'
        }\n${context.selectedCode}\n\`\`\``;
      }

      if (context.fullCode && context.fullCode !== context.selectedCode) {
        formattedMessage += `\n\n**Full File Context:**\n\`\`\`${
          context.language || 'text'
        }\n${context.fullCode}\n\`\`\``;
      }

      if (context.cursorPosition) {
        formattedMessage += `\n\n**Cursor Position:** Line ${context.cursorPosition.line}, Column ${context.cursorPosition.column}`;
      }
    }

    return formattedMessage;
  }

  async switchProvider(
    provider: 'openai' | 'anthropic',
    model?: string
  ): Promise<void> {
    const apiKey = this.config.apiKeys[provider];
    if (!apiKey) {
      throw new Error(`API key for ${provider} is required`);
    }

    const serviceConfig: AIServiceConfig = {
      provider,
      apiKey,
      model:
        model || (provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229'),
      stream: this.config.enableStreaming ?? true,
    };

    this.service = AIServiceFactory.createService(serviceConfig);
    this.config.defaultProvider = provider;

    // Validate new connection
    const isValid = await this.service.validateConnection();
    if (!isValid) {
      throw new Error(`Failed to connect to ${provider} API`);
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.service !== null;
  }

  getCurrentProvider(): string {
    return this.config.defaultProvider;
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.service) {
      throw new Error('AI Manager not initialized');
    }
    return await this.service.getAvailableModels();
  }
}
