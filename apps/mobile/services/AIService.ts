import ApiService from './ApiService';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamResponse {
  content: string;
  finished: boolean;
  error?: string;
}

export class AIService {
  // Explain code functionality
  static async explainCode(
    code: string,
    fileName?: string,
    language?: string
  ): Promise<AsyncGenerator<AIStreamResponse, void, unknown>> {
    const system = `You are a helpful code assistant. Explain the code clearly and concisely, focusing on:
1. What the code does (purpose and functionality)
2. Key components and their roles
3. Important patterns or techniques used
4. Any potential issues or improvements

Keep explanations beginner-friendly but technically accurate.`;

    const userMessage = `Please explain this ${language || 'code'} ${
      fileName ? `from file "${fileName}"` : ''
    }:

\`\`\`${language || ''}
${code}
\`\`\``;

    return this.streamAIResponse(
      [{ role: 'user', content: userMessage }],
      system
    );
  }

  // Generate test cases
  static async generateTests(
    code: string,
    fileName?: string,
    language?: string
  ): Promise<AsyncGenerator<AIStreamResponse, void, unknown>> {
    const system = `You are a testing expert. Generate comprehensive test cases for the provided code, including:
1. Unit tests for individual functions/methods
2. Edge cases and error conditions
3. Integration test scenarios when applicable
4. Mock data and setup if needed

Use appropriate testing frameworks for the language (Jest for JS/TS, pytest for Python, etc.).`;

    const userMessage = `Generate test cases for this ${language || 'code'} ${
      fileName ? `from file "${fileName}"` : ''
    }:

\`\`\`${language || ''}
${code}
\`\`\`

Please provide complete, runnable test code with proper setup and assertions.`;

    return this.streamAIResponse(
      [{ role: 'user', content: userMessage }],
      system
    );
  }

  // Optimize code performance and structure
  static async optimizeCode(
    code: string,
    fileName?: string,
    language?: string
  ): Promise<AsyncGenerator<AIStreamResponse, void, unknown>> {
    const system = `You are a code optimization expert. Analyze the code and suggest improvements for:
1. Performance optimizations
2. Code readability and maintainability
3. Best practices and patterns
4. Security considerations
5. Error handling improvements

Provide the optimized code with explanations of changes made.`;

    const userMessage = `Optimize this ${language || 'code'} ${
      fileName ? `from file "${fileName}"` : ''
    }:

\`\`\`${language || ''}
${code}
\`\`\`

Please provide the improved code with explanations of the optimizations made.`;

    return this.streamAIResponse(
      [{ role: 'user', content: userMessage }],
      system
    );
  }

  // Summarize file or code section
  static async summarizeCode(
    code: string,
    fileName?: string,
    language?: string
  ): Promise<AsyncGenerator<AIStreamResponse, void, unknown>> {
    const system = `You are a code documentation expert. Provide a concise summary that includes:
1. Main purpose and functionality
2. Key dependencies and imports
3. Main classes, functions, or components
4. Notable patterns or architectural decisions
5. Brief overview of complexity and responsibilities

Keep the summary concise but informative.`;

    const userMessage = `Summarize this ${language || 'code'} ${
      fileName ? `from file "${fileName}"` : ''
    }:

\`\`\`${language || ''}
${code}
\`\`\``;

    return this.streamAIResponse(
      [{ role: 'user', content: userMessage }],
      system
    );
  }

  // General AI chat for code assistance
  static async chatAboutCode(
    messages: AIMessage[],
    code?: string,
    fileName?: string,
    language?: string
  ): Promise<AsyncGenerator<AIStreamResponse, void, unknown>> {
    const system = `You are a helpful programming assistant. You can help with:
- Code explanation and documentation
- Debugging and error resolution
- Best practices and optimization
- Testing and quality assurance
- Architecture and design patterns

Be concise, practical, and provide code examples when helpful.`;

    // Add context about the current file if provided
    let contextMessages = [...messages];
    if (code && messages.length === 1) {
      const contextMessage: AIMessage = {
        role: 'user',
        content: `I'm working with this ${language || 'code'} ${
          fileName ? `in file "${fileName}"` : ''
        }:

\`\`\`${language || ''}
${code}
\`\`\`

${messages[0].content}`,
      };
      contextMessages = [contextMessage];
    }

    return this.streamAIResponse(contextMessages, system);
  }

  // Core streaming function
  private static async *streamAIResponse(
    messages: AIMessage[],
    system?: string
  ): AsyncGenerator<AIStreamResponse, void, unknown> {
    try {
      const response = await ApiService.aiChat({
        messages,
        system,
      });

      if (!response.ok) {
        yield {
          content: '',
          finished: true,
          error: `AI service error: ${response.status}`,
        };
        return;
      }

      // For now, just return a simple response without streaming
      // TODO: Implement proper streaming when TextDecoder is available
      const text = await response.text();
      yield {
        content: text,
        finished: true,
      };
    } catch (error) {
      yield {
        content: '',
        finished: true,
        error: error instanceof Error ? error.message : 'AI request failed',
      };
    }
  }

  // Helper to convert streaming response to simple promise for simpler use cases
  static async getAIResponse(
    messages: AIMessage[],
    system?: string
  ): Promise<{ content: string; error?: string }> {
    try {
      let finalContent = '';
      let lastError: string | undefined;

      for await (const response of this.streamAIResponse(messages, system)) {
        finalContent = response.content;
        if (response.error) {
          lastError = response.error;
        }
        if (response.finished) {
          break;
        }
      }

      return { content: finalContent, error: lastError };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'AI request failed',
      };
    }
  }
}

export default AIService;
