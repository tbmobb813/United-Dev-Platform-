import { AIService } from './AIService';

export interface CodebaseContext {
  projectName?: string;
  projectType?: string;
  language: string;
  framework?: string;
  dependencies?: string[];
  fileStructure?: FileNode[];
  recentFiles?: string[];
  codePatterns?: CodePattern[];
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  language?: string;
  size?: number;
  lastModified?: Date;
  children?: FileNode[];
}

export interface CodePattern {
  pattern: string;
  description: string;
  frequency: number;
  examples: string[];
}

export interface ContextualQuery {
  query: string;
  context: {
    currentFile?: string;
    selectedCode?: string;
    cursorPosition?: { line: number; column: number };
    relatedFiles?: string[];
    task?: AssistantTask;
  };
  scope?: QueryScope;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export type AssistantTask =
  | 'explain-code'
  | 'generate-code'
  | 'debug-issue'
  | 'optimize-performance'
  | 'add-feature'
  | 'write-tests'
  | 'document-code'
  | 'refactor-code'
  | 'find-bugs'
  | 'code-review'
  | 'general-help';

export type QueryScope =
  | 'current-file'
  | 'current-function'
  | 'related-files'
  | 'entire-project'
  | 'dependencies'
  | 'external-apis';

export interface ContextualResponse {
  answer: string;
  confidence: number; // 0-100
  sources: ResponseSource[];
  suggestions?: ActionSuggestion[];
  relatedTopics?: string[];
  codeExamples?: CodeExample[];
  followUpQuestions?: string[];
  processingTime: number;
}

export interface ResponseSource {
  type: 'file' | 'documentation' | 'pattern' | 'dependency' | 'knowledge';
  reference: string;
  relevance: number; // 0-100
  snippet?: string;
}

export interface ActionSuggestion {
  action: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  estimatedTime?: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
  context?: string;
}

export class ContextAwareAssistant {
  private aiService: AIService;
  private codebaseContext: CodebaseContext | null = null;
  private conversationHistory: Array<{
    query: ContextualQuery;
    response: ContextualResponse;
  }> = [];
  private cache: Map<
    string,
    { response: ContextualResponse; timestamp: number }
  > = new Map();
  private readonly CACHE_DURATION = 300000; // 5 minutes

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  // Initialize with codebase context
  setCodebaseContext(context: CodebaseContext): void {
    this.codebaseContext = context;
  }

  // Update context incrementally
  updateContext(updates: Partial<CodebaseContext>): void {
    if (this.codebaseContext) {
      this.codebaseContext = { ...this.codebaseContext, ...updates };
    } else {
      this.codebaseContext = updates as CodebaseContext;
    }
  }

  // Main query method
  async query(contextualQuery: ContextualQuery): Promise<ContextualResponse> {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(contextualQuery);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      return {
        ...cached,
        processingTime: Date.now() - startTime,
      };
    }

    try {
      // Build comprehensive context prompt
      const prompt = this.buildContextualPrompt(contextualQuery);

      const response = await this.aiService.generateResponse([
        {
          role: 'system',
          content: this.getSystemPrompt(
            contextualQuery.context.task || 'general-help'
          ),
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const contextualResponse = this.parseResponse(
        response.content,
        contextualQuery
      );

      // Add to conversation history
      this.conversationHistory.push({
        query: contextualQuery,
        response: contextualResponse,
      });

      // Keep history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Cache the response
      this.cacheResponse(cacheKey, contextualResponse);

      return {
        ...contextualResponse,
        processingTime: Date.now() - startTime,
      };
    } catch {
      return {
        answer:
          'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.',
        confidence: 0,
        sources: [],
        suggestions: [
          {
            action: 'retry',
            description: 'Try asking the question again',
            confidence: 80,
            impact: 'low',
          },
        ],
        relatedTopics: [],
        codeExamples: [],
        followUpQuestions: [],
        processingTime: Date.now() - startTime,
      };
    }
  }

  // Analyze entire codebase and provide insights
  async analyzeCodebase(): Promise<{
    overview: string;
    insights: string[];
    recommendations: string[];
    patterns: CodePattern[];
    healthScore: number;
  }> {
    if (!this.codebaseContext) {
      throw new Error('Codebase context not initialized');
    }

    const prompt = this.buildCodebaseAnalysisPrompt();

    const response = await this.aiService.generateResponse([
      {
        role: 'system',
        content: `You are a senior software architect analyzing a codebase. Provide comprehensive insights about:
        1. Overall architecture and structure
        2. Code quality and patterns
        3. Potential improvements
        4. Technical debt assessment
        5. Best practices adherence
        
        Be specific and actionable in your recommendations.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return this.parseCodebaseAnalysis(response.content);
  }

  // Get contextual code suggestions
  async getCodeSuggestions(context: {
    currentCode: string;
    language: string;
    intent: string;
    fileName?: string;
  }): Promise<{
    suggestions: CodeExample[];
    explanation: string;
    bestPractices: string[];
  }> {
    const prompt = `
Context: ${this.codebaseContext?.projectType || 'General'} project in ${
      context.language
    }
${context.fileName ? `File: ${context.fileName}` : ''}

Current Code:
\`\`\`${context.language}
${context.currentCode}
\`\`\`

Intent: ${context.intent}

${this.getProjectContextSummary()}

Provide code suggestions that:
1. Follow project patterns and conventions
2. Integrate well with existing codebase
3. Follow best practices for ${context.language}
4. Consider the project's dependencies and structure

Return JSON format with suggestions array and explanation.`;

    const response = await this.aiService.generateResponse([
      {
        role: 'system',
        content:
          'You are an expert developer providing contextual code suggestions. Consider the project context and provide practical, well-integrated suggestions.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return this.parseCodeSuggestions(response.content, context.language);
  }

  private buildContextualPrompt(query: ContextualQuery): string {
    const { query: userQuery, context, scope } = query;

    let prompt = `Question: ${userQuery}\n\n`;

    // Add project context
    if (this.codebaseContext) {
      prompt += `Project Context:
- Type: ${this.codebaseContext.projectType || 'Unknown'}
- Language: ${this.codebaseContext.language}
- Framework: ${this.codebaseContext.framework || 'None specified'}
${
  this.codebaseContext.dependencies
    ? `- Dependencies: ${this.codebaseContext.dependencies.join(', ')}\n`
    : ''
}
`;
    }

    // Add current file context
    if (context.currentFile) {
      prompt += `\nCurrent File: ${context.currentFile}`;
    }

    // Add selected code
    if (context.selectedCode) {
      const language = this.codebaseContext?.language || 'text';
      prompt += `\n\nSelected Code:
\`\`\`${language}
${context.selectedCode}
\`\`\``;
    }

    // Add cursor position context
    if (context.cursorPosition) {
      prompt += `\nCursor Position: Line ${context.cursorPosition.line}, Column ${context.cursorPosition.column}`;
    }

    // Add related files
    if (context.relatedFiles && context.relatedFiles.length > 0) {
      prompt += `\nRelated Files: ${context.relatedFiles.join(', ')}`;
    }

    // Add scope information
    if (scope) {
      prompt += `\nScope: ${scope}`;
    }

    // Add conversation history context (last 3 exchanges)
    if (this.conversationHistory.length > 0) {
      const recentHistory = this.conversationHistory.slice(-3);
      prompt += '\n\nRecent Conversation:';
      recentHistory.forEach((exchange, index) => {
        prompt += `\n${index + 1}. Q: ${exchange.query.query.substring(
          0,
          100
        )}...`;
        prompt += `\n   A: ${exchange.response.answer.substring(0, 150)}...`;
      });
    }

    // Add patterns context
    if (this.codebaseContext?.codePatterns) {
      const relevantPatterns = this.codebaseContext.codePatterns.slice(0, 3);
      if (relevantPatterns.length > 0) {
        prompt += '\n\nCommon Patterns in Codebase:';
        relevantPatterns.forEach(pattern => {
          prompt += `\n- ${pattern.pattern}: ${pattern.description}`;
        });
      }
    }

    return prompt;
  }

  private buildCodebaseAnalysisPrompt(): string {
    if (!this.codebaseContext) {
      return '';
    }

    return `Analyze this codebase:

Project: ${this.codebaseContext.projectName || 'Unknown'}
Type: ${this.codebaseContext.projectType || 'Unknown'}
Language: ${this.codebaseContext.language}
Framework: ${this.codebaseContext.framework || 'None'}

Dependencies:
${this.codebaseContext.dependencies?.join('\n') || 'None specified'}

File Structure:
${this.formatFileStructure(this.codebaseContext.fileStructure || [])}

${
  this.codebaseContext.codePatterns
    ? `
Code Patterns:
${this.codebaseContext.codePatterns
  .map(p => `- ${p.pattern}: ${p.description} (used ${p.frequency} times)`)
  .join('\n')}
`
    : ''
}

Provide comprehensive analysis including:
1. Architecture overview
2. Code quality assessment
3. Identified patterns and anti-patterns
4. Technical debt areas
5. Improvement recommendations
6. Health score (0-100)

Format as JSON:
{
  "overview": "detailed overview",
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["rec 1", "rec 2", ...],
  "patterns": [{"pattern": "name", "description": "desc", "frequency": number}],
  "healthScore": number
}`;
  }

  private getSystemPrompt(task: AssistantTask): string {
    const basePrompt = `You are an expert software development assistant with deep understanding of codebases, patterns, and best practices.`;

    const taskPrompts = {
      'explain-code': `${basePrompt} Focus on explaining code clearly, including purpose, functionality, and integration with the broader codebase.`,
      'generate-code': `${basePrompt} Generate high-quality code that follows project conventions, integrates well, and includes proper error handling.`,
      'debug-issue': `${basePrompt} Help identify and resolve bugs by analyzing code, suggesting debugging approaches, and providing fixes.`,
      'optimize-performance': `${basePrompt} Focus on performance optimization, identifying bottlenecks, and suggesting efficient solutions.`,
      'add-feature': `${basePrompt} Help design and implement new features that integrate seamlessly with existing code architecture.`,
      'write-tests': `${basePrompt} Generate comprehensive tests that cover edge cases and follow testing best practices for the project.`,
      'document-code': `${basePrompt} Create clear, comprehensive documentation that helps other developers understand and maintain the code.`,
      'refactor-code': `${basePrompt} Suggest safe refactoring improvements that enhance maintainability without changing functionality.`,
      'find-bugs': `${basePrompt} Analyze code for potential bugs, security issues, and edge cases that might cause problems.`,
      'code-review': `${basePrompt} Provide thorough code review feedback focusing on quality, security, performance, and maintainability.`,
      'general-help': `${basePrompt} Provide helpful guidance on software development questions with context-aware recommendations.`,
    };

    return taskPrompts[task] || taskPrompts['general-help'];
  }

  private parseResponse(
    content: string,
    query: ContextualQuery
  ): ContextualResponse {
    // Try to parse structured response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          answer: parsed.answer || content,
          confidence: parsed.confidence || 75,
          sources: parsed.sources || [],
          suggestions: parsed.suggestions || [],
          relatedTopics: parsed.relatedTopics || [],
          codeExamples: parsed.codeExamples || [],
          followUpQuestions: parsed.followUpQuestions || [],
          processingTime: 0,
        };
      }
    } catch {
      // Fall back to plain text parsing
    }

    return {
      answer: content,
      confidence: 75,
      sources: this.extractSources(content, query),
      suggestions: this.extractSuggestions(content),
      relatedTopics: this.extractRelatedTopics(content),
      codeExamples: this.extractCodeExamples(content),
      followUpQuestions: this.extractFollowUpQuestions(content),
      processingTime: 0,
    };
  }

  private parseCodebaseAnalysis(content: string): {
    overview: string;
    insights: string[];
    recommendations: string[];
    patterns: CodePattern[];
    healthScore: number;
  } {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          overview: analysis.overview || 'Analysis completed',
          insights: Array.isArray(analysis.insights) ? analysis.insights : [],
          recommendations: Array.isArray(analysis.recommendations)
            ? analysis.recommendations
            : [],
          patterns: Array.isArray(analysis.patterns) ? analysis.patterns : [],
          healthScore: analysis.healthScore || 70,
        };
      }
    } catch {
      // Fallback parsing
    }

    return {
      overview: content.substring(0, 500) + '...',
      insights: [],
      recommendations: [],
      patterns: [],
      healthScore: 70,
    };
  }

  private parseCodeSuggestions(
    content: string,
    language: string
  ): {
    suggestions: CodeExample[];
    explanation: string;
    bestPractices: string[];
  } {
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const suggestions: CodeExample[] = codeBlocks.map((block, index) => {
      const code = block.replace(/```\w*\n?/g, '').trim();
      return {
        title: `Suggestion ${index + 1}`,
        description: `Code suggestion for ${language}`,
        code,
        language,
        context: 'Generated based on project patterns',
      };
    });

    return {
      suggestions,
      explanation: content.replace(/```[\s\S]*?```/g, '').trim(),
      bestPractices: this.extractBestPractices(content),
    };
  }

  private extractSources(
    content: string,
    query: ContextualQuery
  ): ResponseSource[] {
    const sources: ResponseSource[] = [];

    if (query.context.currentFile) {
      sources.push({
        type: 'file',
        reference: query.context.currentFile,
        relevance: 90,
      });
    }

    return sources;
  }

  private extractSuggestions(content: string): ActionSuggestion[] {
    const suggestions: ActionSuggestion[] = [];

    // Look for common action words
    const actionPatterns = [
      /consider (.*?)(?:\.|$)/gi,
      /you (?:should|could|might) (.*?)(?:\.|$)/gi,
      /try (.*?)(?:\.|$)/gi,
    ];

    actionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.slice(0, 3).forEach(match => {
          suggestions.push({
            action: match.trim(),
            description: 'AI suggestion',
            confidence: 70,
            impact: 'medium',
          });
        });
      }
    });

    return suggestions;
  }

  private extractRelatedTopics(_content: string): string[] {
    // Simple extraction - could be enhanced with NLP
    return [];
  }

  private extractCodeExamples(content: string): CodeExample[] {
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g) || [];
    return codeBlocks.map((block, index) => {
      const languageMatch = block.match(/```(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'text';
      const code = block
        .replace(/```\w*\n?/g, '')
        .replace(/```/g, '')
        .trim();

      return {
        title: `Example ${index + 1}`,
        description: `Code example in ${language}`,
        code,
        language,
      };
    });
  }

  private extractFollowUpQuestions(_content: string): string[] {
    // Could be enhanced to suggest relevant follow-up questions
    return [];
  }

  private extractBestPractices(content: string): string[] {
    const practices: string[] = [];
    const practicePatterns = [
      /best practice:? (.*?)(?:\.|$)/gi,
      /always (.*?)(?:\.|$)/gi,
      /remember to (.*?)(?:\.|$)/gi,
    ];

    practicePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          practices.push(match.trim());
        });
      }
    });

    return practices.slice(0, 5);
  }

  private formatFileStructure(files: FileNode[]): string {
    const formatNode = (node: FileNode, depth = 0): string => {
      const indent = '  '.repeat(depth);
      let result = `${indent}${node.name}${
        node.type === 'directory' ? '/' : ''
      }\n`;

      if (node.children) {
        result += node.children
          .map(child => formatNode(child, depth + 1))
          .join('');
      }

      return result;
    };

    return files.map(file => formatNode(file)).join('');
  }

  private getProjectContextSummary(): string {
    if (!this.codebaseContext) {
      return '';
    }

    return `
Project Context Summary:
- Language: ${this.codebaseContext.language}
- Framework: ${this.codebaseContext.framework || 'None'}
- Dependencies: ${
      this.codebaseContext.dependencies?.slice(0, 5).join(', ') || 'None'
    }
${
  this.codebaseContext.codePatterns
    ? `- Common patterns: ${this.codebaseContext.codePatterns
        .slice(0, 3)
        .map(p => p.pattern)
        .join(', ')}`
    : ''
}`;
  }

  private generateCacheKey(query: ContextualQuery): string {
    const contextString = JSON.stringify({
      query: query.query,
      currentFile: query.context.currentFile,
      task: query.context.task,
      scope: query.scope,
    });

    // Simple hash function for browser compatibility
    let hash = 0;
    for (let i = 0; i < contextString.length; i++) {
      const char = contextString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36).substring(0, 12);
  }

  private getCachedResponse(key: string): ContextualResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.response;
    }

    this.cleanCache();
    return null;
  }

  private cacheResponse(key: string, response: ContextualResponse): void {
    this.cache.set(key, {
      response,
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

  // Get conversation history
  getConversationHistory(): Array<{
    query: ContextualQuery;
    response: ContextualResponse;
  }> {
    return [...this.conversationHistory];
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses to calculate
    };
  }
}
