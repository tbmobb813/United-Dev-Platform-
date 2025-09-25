import { AIService } from './AIService';

export interface CodeCompletionRequest {
  fileName: string;
  language: string;
  code: string;
  position: {
    line: number;
    column: number;
  };
  context?: {
    projectType?: string;
    imports?: string[];
    dependencies?: string[];
  };
}

export interface CodeSuggestion {
  text: string;
  description?: string;
  type:
    | 'completion'
    | 'snippet'
    | 'function'
    | 'variable'
    | 'class'
    | 'interface'
    | 'property';
  priority: number;
  insertText: string;
  range?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface CodeCompletionResponse {
  suggestions: CodeSuggestion[];
  hasMore: boolean;
  processingTime: number;
}

export class CodeCompletionProvider {
  private aiService: AIService;
  private cache: Map<
    string,
    { suggestions: CodeSuggestion[]; timestamp: number }
  > = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async getCompletions(
    request: CodeCompletionRequest
  ): Promise<CodeCompletionResponse> {
    const startTime = Date.now();

    // Generate cache key
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    const cached = this.getCachedSuggestions(cacheKey);
    if (cached) {
      return {
        suggestions: cached,
        hasMore: false,
        processingTime: Date.now() - startTime,
      };
    }

    try {
      // Prepare context for AI
      const prompt = this.buildCompletionPrompt(request);

      const response = await this.aiService.generateResponse([
        {
          role: 'system',
          content: `You are an expert code completion assistant. Provide intelligent code suggestions based on context.
          
Rules:
1. Return ONLY valid code completions, no explanations
2. Consider the file type, language, and current context
3. Prioritize commonly used patterns and best practices
4. Keep suggestions concise and relevant
5. Return multiple options when appropriate
6. Format response as JSON array of suggestions`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const suggestions = this.parseAIResponse(response.content, request);

      // Cache the results
      this.cacheResults(cacheKey, suggestions);

      return {
        suggestions,
        hasMore: false,
        processingTime: Date.now() - startTime,
      };
    } catch {
      // Silent fail for non-critical operation

      // Return fallback suggestions
      return {
        suggestions: this.getFallbackSuggestions(request),
        hasMore: false,
        processingTime: Date.now() - startTime,
      };
    }
  }

  private buildCompletionPrompt(request: CodeCompletionRequest): string {
    const { fileName, language, code, position, context } = request;

    // Get code before cursor
    const lines = code.split('\n');
    const currentLine = lines[position.line - 1] || '';
    const beforeCursor = currentLine.substring(0, position.column - 1);
    const afterCursor = currentLine.substring(position.column - 1);

    // Get surrounding context (10 lines before and after)
    const contextStart = Math.max(0, position.line - 10);
    const contextEnd = Math.min(lines.length, position.line + 10);
    const contextLines = lines.slice(contextStart, contextEnd);

    return `File: ${fileName}
Language: ${language}
${context?.projectType ? `Project Type: ${context.projectType}` : ''}

Context around cursor:
\`\`\`${language}
${contextLines.join('\n')}
\`\`\`

Current line: "${beforeCursor}|${afterCursor}"
Cursor position: Line ${position.line}, Column ${position.column}

${context?.imports ? `Available imports:\n${context.imports.join('\n')}` : ''}

Provide relevant code completions for the cursor position. Consider:
- Variable names and types in scope
- Function/method suggestions
- Property access completions
- Import statements
- Language-specific patterns
- Best practices for ${language}

Return suggestions as JSON array with format:
[
  {
    "text": "suggestion text",
    "description": "brief description",
    "type": "completion|snippet|function|variable|class|interface",
    "priority": 1-10,
    "insertText": "text to insert"
  }
]`;
  }

  private parseAIResponse(
    content: string,
    request: CodeCompletionRequest
  ): CodeSuggestion[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return this.extractSuggestionsFromText(content, request);
      }

      const suggestions = JSON.parse(jsonMatch[0]);

      interface SuggestionData {
        text?: string;
        description?: string;
        type?: string;
        priority?: number;
        insertText?: string;
      }

      return suggestions
        .map((suggestion: SuggestionData, index: number) => ({
          text: suggestion.text || suggestion.insertText || '',
          description: suggestion.description || '',
          type: suggestion.type || 'completion',
          priority: suggestion.priority || 10 - index,
          insertText: suggestion.insertText || suggestion.text || '',
        }))
        .filter((s: CodeSuggestion) => s.text.length > 0);
    } catch {
      return this.extractSuggestionsFromText(content, request);
    }
  }

  private extractSuggestionsFromText(
    content: string,
    _request: CodeCompletionRequest
  ): CodeSuggestion[] {
    // Extract code blocks or individual suggestions from plain text
    const suggestions: CodeSuggestion[] = [];

    // Look for code blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g);
    if (codeBlocks) {
      codeBlocks.forEach((block, index) => {
        const code = block.replace(/```\w*\n?/g, '').trim();
        if (code) {
          suggestions.push({
            text: code.split('\n')[0], // First line as preview
            description: `Code suggestion ${index + 1}`,
            type: 'snippet',
            priority: 8 - index,
            insertText: code,
          });
        }
      });
    }

    // Look for single-line suggestions
    const lines = content
      .split('\n')
      .filter(
        line =>
          line.trim() &&
          !line.includes('```') &&
          !line.toLowerCase().includes('suggestion')
      );

    lines.slice(0, 5).forEach((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine && !suggestions.some(s => s.insertText === cleanLine)) {
        suggestions.push({
          text:
            cleanLine.substring(0, 50) + (cleanLine.length > 50 ? '...' : ''),
          description: 'AI suggestion',
          type: 'completion',
          priority: 6 - index,
          insertText: cleanLine,
        });
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }

  private getFallbackSuggestions(
    request: CodeCompletionRequest
  ): CodeSuggestion[] {
    const { language, code, position } = request;

    // Get current word/context
    const lines = code.split('\n');
    const currentLine = lines[position.line - 1] || '';
    const beforeCursor = currentLine.substring(0, position.column - 1);

    // Language-specific fallback suggestions
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        return this.getJavaScriptFallbacks(beforeCursor);
      case 'python':
        return this.getPythonFallbacks(beforeCursor);
      case 'java':
        return this.getJavaFallbacks(beforeCursor);
      default:
        return this.getGenericFallbacks();
    }
  }

  private getJavaScriptFallbacks(beforeCursor: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (beforeCursor.endsWith('.')) {
      suggestions.push(
        {
          text: 'length',
          description: 'Array/String length',
          type: 'property',
          priority: 9,
          insertText: 'length',
        },
        {
          text: 'map()',
          description: 'Array map method',
          type: 'function',
          priority: 8,
          insertText: 'map((item) => {\n  \n})',
        },
        {
          text: 'filter()',
          description: 'Array filter method',
          type: 'function',
          priority: 8,
          insertText: 'filter((item) => )',
        },
        {
          text: 'forEach()',
          description: 'Array forEach method',
          type: 'function',
          priority: 7,
          insertText: 'forEach((item) => {\n  \n})',
        }
      );
    } else if (
      beforeCursor.includes('const ') ||
      beforeCursor.includes('let ') ||
      beforeCursor.includes('var ')
    ) {
      suggestions.push(
        {
          text: 'useState',
          description: 'React useState hook',
          type: 'function',
          priority: 9,
          insertText: 'useState()',
        },
        {
          text: 'useEffect',
          description: 'React useEffect hook',
          type: 'function',
          priority: 8,
          insertText: 'useEffect(() => {\n  \n}, [])',
        }
      );
    }

    return suggestions;
  }

  private getPythonFallbacks(beforeCursor: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (beforeCursor.endsWith('.')) {
      suggestions.push(
        {
          text: 'append()',
          description: 'List append method',
          type: 'function',
          priority: 9,
          insertText: 'append()',
        },
        {
          text: 'split()',
          description: 'String split method',
          type: 'function',
          priority: 8,
          insertText: 'split()',
        },
        {
          text: 'join()',
          description: 'String join method',
          type: 'function',
          priority: 8,
          insertText: 'join()',
        }
      );
    }

    return suggestions;
  }

  private getJavaFallbacks(beforeCursor: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (beforeCursor.endsWith('.')) {
      suggestions.push(
        {
          text: 'toString()',
          description: 'Convert to string',
          type: 'function',
          priority: 9,
          insertText: 'toString()',
        },
        {
          text: 'length()',
          description: 'String length',
          type: 'function',
          priority: 8,
          insertText: 'length()',
        },
        {
          text: 'size()',
          description: 'Collection size',
          type: 'function',
          priority: 8,
          insertText: 'size()',
        }
      );
    }

    return suggestions;
  }

  private getGenericFallbacks(_beforeCursor?: string): CodeSuggestion[] {
    return [
      {
        text: 'function',
        description: 'Function declaration',
        type: 'snippet',
        priority: 7,
        insertText: 'function name() {\n  \n}',
      },
      {
        text: 'if',
        description: 'If statement',
        type: 'snippet',
        priority: 8,
        insertText: 'if (condition) {\n  \n}',
      },
      {
        text: 'for',
        description: 'For loop',
        type: 'snippet',
        priority: 7,
        insertText: 'for (let i = 0; i < length; i++) {\n  \n}',
      },
    ];
  }

  private generateCacheKey(request: CodeCompletionRequest): string {
    const { fileName, language, code, position } = request;

    // Create a hash-like key based on context
    const contextHash = `${fileName}-${language}-${position.line}-${position.column}`;
    const codeContext = code
      .split('\n')
      .slice(Math.max(0, position.line - 5), position.line + 1)
      .join('\n');

    return `${contextHash}-${codeContext.length}`;
  }

  private getCachedSuggestions(key: string): CodeSuggestion[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.suggestions;
    }

    // Clean expired entries
    this.cleanCache();
    return null;
  }

  private cacheResults(key: string, suggestions: CodeSuggestion[]): void {
    this.cache.set(key, {
      suggestions,
      timestamp: Date.now(),
    });
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cached suggestions
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; oldestEntry: number; newestEntry: number } {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);

    return {
      size: this.cache.size,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0,
    };
  }
}
