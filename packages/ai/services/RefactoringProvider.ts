import { AIService } from './AIService';

export interface RefactoringRequest {
  fileName: string;
  language: string;
  code: string;
  selectedCode?: string;
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  refactoringType?: RefactoringType;
  context?: {
    projectType?: string;
    imports?: string[];
    dependencies?: string[];
    codeStyle?: CodeStyle;
  };
}

export type RefactoringType =
  | 'extract-method'
  | 'extract-variable'
  | 'rename-symbol'
  | 'inline-variable'
  | 'move-method'
  | 'simplify-expression'
  | 'optimize-imports'
  | 'convert-to-arrow'
  | 'add-type-annotations'
  | 'remove-dead-code'
  | 'improve-naming'
  | 'split-long-method'
  | 'consolidate-conditionals'
  | 'auto-suggest';

export interface CodeStyle {
  indentSize: number;
  useTabs: boolean;
  semicolons: boolean;
  quotes: 'single' | 'double';
  trailingComma: boolean;
  maxLineLength: number;
}

export interface RefactoringSuggestion {
  id: string;
  type: RefactoringType;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'suggestion' | 'optimization';
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  originalCode: string;
  refactoredCode: string;
  explanation: string;
  benefits: string[];
  risks: string[];
  range: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  preview?: string;
}

export interface RefactoringResponse {
  suggestions: RefactoringSuggestion[];
  analysis: {
    codeQuality: number; // 0-100
    maintainability: number; // 0-100
    readability: number; // 0-100
    performance: number; // 0-100
    issues: string[];
    improvements: string[];
  };
  processingTime: number;
}

export class RefactoringProvider {
  private aiService: AIService;
  private cache: Map<
    string,
    { response: RefactoringResponse; timestamp: number }
  > = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async analyzeAndSuggest(
    request: RefactoringRequest
  ): Promise<RefactoringResponse> {
    const startTime = Date.now();

    // Generate cache key
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      return {
        ...cached,
        processingTime: Date.now() - startTime,
      };
    }

    try {
      const analysis = await this.performAnalysis(request);
      const suggestions = await this.generateSuggestions(request, analysis);

      const response: RefactoringResponse = {
        suggestions,
        analysis,
        processingTime: Date.now() - startTime,
      };

      // Cache the results
      this.cacheResponse(cacheKey, response);

      return response;
    } catch {
      return {
        suggestions: [],
        analysis: {
          codeQuality: 50,
          maintainability: 50,
          readability: 50,
          performance: 50,
          issues: ['Analysis failed - unable to connect to AI service'],
          improvements: [],
        },
        processingTime: Date.now() - startTime,
      };
    }
  }

  async performSpecificRefactoring(
    request: RefactoringRequest,
    type: RefactoringType
  ): Promise<RefactoringSuggestion | null> {
    try {
      const prompt = this.buildRefactoringPrompt(request, type);

      const response = await this.aiService.generateResponse([
        {
          role: 'system',
          content: `You are an expert code refactoring assistant. Provide specific, safe, and beneficial refactoring suggestions.
          
Rules:
1. Only suggest safe refactorings that preserve functionality
2. Provide clear explanations for changes
3. Consider maintainability, readability, and performance
4. Respect existing code style and patterns
5. Return structured JSON response`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return this.parseRefactoringSuggestion(response.content, request, type);
    } catch {
      return null;
    }
  }

  private async performAnalysis(
    request: RefactoringRequest
  ): Promise<RefactoringResponse['analysis']> {
    const prompt = this.buildAnalysisPrompt(request);

    const response = await this.aiService.generateResponse([
      {
        role: 'system',
        content: `You are a code quality analyzer. Analyze the provided code and return a structured assessment.
        
Focus on:
1. Code quality metrics
2. Maintainability issues
3. Readability problems
4. Performance concerns
5. Best practice violations

Return JSON format with scores (0-100) and specific issues/improvements.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return this.parseAnalysisResponse(response.content);
  }

  private async generateSuggestions(
    request: RefactoringRequest,
    analysis: RefactoringResponse['analysis']
  ): Promise<RefactoringSuggestion[]> {
    const prompt = this.buildSuggestionsPrompt(request, analysis);

    const response = await this.aiService.generateResponse([
      {
        role: 'system',
        content: `You are a refactoring expert. Based on the code analysis, provide specific refactoring suggestions.
        
Each suggestion should:
1. Have a clear purpose and benefit
2. Include before/after code examples
3. Explain the reasoning
4. Assess the impact and risks
5. Be actionable and safe

Return JSON array of structured suggestions.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return this.parseSuggestionsResponse(response.content, request);
  }

  private buildAnalysisPrompt(request: RefactoringRequest): string {
    const { fileName, language, code, context } = request;

    return `Analyze this ${language} code for quality, maintainability, readability, and performance:

File: ${fileName}
${context?.projectType ? `Project Type: ${context.projectType}` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

${
  context?.codeStyle
    ? `Code Style Preferences:
- Indent: ${context.codeStyle.useTabs ? 'tabs' : `${context.codeStyle.indentSize} spaces`}
- Quotes: ${context.codeStyle.quotes}
- Semicolons: ${context.codeStyle.semicolons ? 'required' : 'optional'}
- Max line length: ${context.codeStyle.maxLineLength}
`
    : ''
}

Return analysis as JSON:
{
  "codeQuality": number (0-100),
  "maintainability": number (0-100),
  "readability": number (0-100),
  "performance": number (0-100),
  "issues": ["specific issues found"],
  "improvements": ["specific improvement opportunities"]
}`;
  }

  private buildSuggestionsPrompt(
    request: RefactoringRequest,
    analysis: RefactoringResponse['analysis']
  ): string {
    const { fileName, language, code, selectedCode } = request;

    return `Based on this analysis, provide refactoring suggestions:

Analysis Results:
- Code Quality: ${analysis.codeQuality}/100
- Maintainability: ${analysis.maintainability}/100
- Readability: ${analysis.readability}/100
- Performance: ${analysis.performance}/100

Issues: ${analysis.issues.join(', ')}
Improvements: ${analysis.improvements.join(', ')}

File: ${fileName}
Language: ${language}

${
  selectedCode
    ? `Selected Code:
\`\`\`${language}
${selectedCode}
\`\`\`

Full Context:`
    : 'Code:'
}
\`\`\`${language}
${code}
\`\`\`

Provide 3-5 specific refactoring suggestions as JSON array:
[
  {
    "type": "refactoring-type",
    "title": "Brief title",
    "description": "What this refactoring does",
    "severity": "info|warning|suggestion|optimization",
    "confidence": number (0-100),
    "impact": "low|medium|high",
    "originalCode": "code to be changed",
    "refactoredCode": "improved code",
    "explanation": "why this improves the code",
    "benefits": ["list of benefits"],
    "risks": ["potential risks or considerations"],
    "startLine": number,
    "endLine": number
  }
]`;
  }

  private buildRefactoringPrompt(
    request: RefactoringRequest,
    type: RefactoringType
  ): string {
    const { fileName, language, code, selectedCode } = request;

    const typeDescriptions = {
      'extract-method': 'Extract code into a separate method',
      'extract-variable': 'Extract expression into a variable',
      'rename-symbol': 'Suggest better names for variables/functions',
      'inline-variable': 'Replace variable with its value',
      'move-method': 'Move method to more appropriate class',
      'simplify-expression': 'Simplify complex expressions',
      'optimize-imports': 'Organize and optimize import statements',
      'convert-to-arrow': 'Convert function to arrow function',
      'add-type-annotations': 'Add TypeScript type annotations',
      'remove-dead-code': 'Remove unused code',
      'improve-naming': 'Improve variable and function names',
      'split-long-method': 'Break down long methods',
      'consolidate-conditionals': 'Simplify complex conditional logic',
      'auto-suggest': 'Automatically suggest best refactoring',
    };

    return `Perform ${type} refactoring: ${typeDescriptions[type]}

File: ${fileName}
Language: ${language}

${
  selectedCode
    ? `Target Code:
\`\`\`${language}
${selectedCode}
\`\`\`

Context:`
    : 'Code:'
}
\`\`\`${language}
${code}
\`\`\`

Provide a specific ${type} refactoring suggestion as JSON:
{
  "type": "${type}",
  "title": "Refactoring title",
  "description": "What changes will be made",
  "originalCode": "current code",
  "refactoredCode": "improved code",
  "explanation": "detailed explanation of benefits",
  "benefits": ["list of benefits"],
  "risks": ["any risks or considerations"]
}`;
  }

  private parseAnalysisResponse(
    content: string
  ): RefactoringResponse['analysis'] {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          codeQuality: analysis.codeQuality || 50,
          maintainability: analysis.maintainability || 50,
          readability: analysis.readability || 50,
          performance: analysis.performance || 50,
          issues: Array.isArray(analysis.issues) ? analysis.issues : [],
          improvements: Array.isArray(analysis.improvements)
            ? analysis.improvements
            : [],
        };
      }
    } catch {
      // Fallback parsing
    }

    return {
      codeQuality: 50,
      maintainability: 50,
      readability: 50,
      performance: 50,
      issues: ['Unable to analyze code'],
      improvements: [],
    };
  }

  private parseSuggestionsResponse(
    content: string,
    request: RefactoringRequest
  ): RefactoringSuggestion[] {
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        interface SuggestionData {
          type?: string;
          title?: string;
          description?: string;
          severity?: string;
          confidence?: number;
          impact?: string;
          originalCode?: string;
          refactoredCode?: string;
          explanation?: string;
          benefits?: string[];
          risks?: string[];
          startLine?: number;
          endLine?: number;
        }

        const suggestions = JSON.parse(jsonMatch[0]);
        return suggestions
          .map((suggestion: SuggestionData, index: number) => ({
            id: `refactor-${Date.now()}-${index}`,
            type: suggestion.type || 'auto-suggest',
            title: suggestion.title || 'Code Improvement',
            description: suggestion.description || 'Improve code quality',
            severity: suggestion.severity || 'suggestion',
            confidence: suggestion.confidence || 75,
            impact: suggestion.impact || 'medium',
            originalCode: suggestion.originalCode || '',
            refactoredCode: suggestion.refactoredCode || '',
            explanation: suggestion.explanation || 'Code improvement',
            benefits: Array.isArray(suggestion.benefits)
              ? suggestion.benefits
              : [],
            risks: Array.isArray(suggestion.risks) ? suggestion.risks : [],
            range: {
              startLine: suggestion.startLine || 1,
              startColumn: 1,
              endLine: suggestion.endLine || 1,
              endColumn: 100,
            },
          }))
          .filter(
            (s: RefactoringSuggestion) => s.originalCode && s.refactoredCode
          );
      }
    } catch {
      // Fallback parsing
    }

    return this.extractSuggestionsFromText(content, request);
  }

  private parseRefactoringSuggestion(
    content: string,
    request: RefactoringRequest,
    type: RefactoringType
  ): RefactoringSuggestion | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggestion = JSON.parse(jsonMatch[0]);
        return {
          id: `refactor-${Date.now()}`,
          type,
          title: suggestion.title || 'Code Refactoring',
          description: suggestion.description || 'Improve code structure',
          severity: 'suggestion',
          confidence: 80,
          impact: 'medium',
          originalCode: suggestion.originalCode || '',
          refactoredCode: suggestion.refactoredCode || '',
          explanation: suggestion.explanation || 'Code improvement',
          benefits: Array.isArray(suggestion.benefits)
            ? suggestion.benefits
            : [],
          risks: Array.isArray(suggestion.risks) ? suggestion.risks : [],
          range: {
            startLine: 1,
            startColumn: 1,
            endLine: 1,
            endColumn: 100,
          },
        };
      }
    } catch {
      // Silent fail
    }

    return null;
  }

  private extractSuggestionsFromText(
    _content: string,
    _request: RefactoringRequest
  ): RefactoringSuggestion[] {
    // Fallback when JSON parsing fails
    return [];
  }

  private generateCacheKey(request: RefactoringRequest): string {
    const { fileName, language, code, selectedCode, refactoringType } = request;
    const contentHash = `${fileName}-${language}-${code.length}-${selectedCode?.length || 0}-${refactoringType || 'auto'}`;
    return contentHash;
  }

  private getCachedResponse(key: string): RefactoringResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.response;
    }

    // Clean expired entries
    this.cleanCache();
    return null;
  }

  private cacheResponse(key: string, response: RefactoringResponse): void {
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

  // Get quick suggestions for common refactoring patterns
  getQuickSuggestions(language: string, code: string): RefactoringSuggestion[] {
    // Language-specific quick suggestions
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        return this.getJavaScriptQuickSuggestions(code);
      case 'python':
        return this.getPythonQuickSuggestions(code);
      default:
        return this.getGenericQuickSuggestions(code);
    }
  }

  private getJavaScriptQuickSuggestions(code: string): RefactoringSuggestion[] {
    const suggestions: RefactoringSuggestion[] = [];

    // Check for function declarations that could be arrow functions
    if (code.includes('function ') && !code.includes('function*')) {
      suggestions.push({
        id: 'js-arrow-function',
        type: 'convert-to-arrow',
        title: 'Convert to Arrow Function',
        description: 'Convert function declaration to arrow function',
        severity: 'suggestion',
        confidence: 85,
        impact: 'low',
        originalCode: 'function name() { ... }',
        refactoredCode: 'const name = () => { ... }',
        explanation:
          'Arrow functions provide cleaner syntax and lexical this binding',
        benefits: [
          'Cleaner syntax',
          'Lexical this binding',
          'More modern ES6+ style',
        ],
        risks: ['Changes this context', 'Not hoisted'],
        range: { startLine: 1, startColumn: 1, endLine: 1, endColumn: 100 },
      });
    }

    // Check for var usage
    if (code.includes('var ')) {
      suggestions.push({
        id: 'js-let-const',
        type: 'improve-naming',
        title: 'Replace var with let/const',
        description: 'Use modern variable declarations',
        severity: 'warning',
        confidence: 95,
        impact: 'medium',
        originalCode: 'var variable = value;',
        refactoredCode: 'const variable = value;',
        explanation:
          'let and const provide better scoping and prevent common errors',
        benefits: [
          'Block scoping',
          'Prevents hoisting issues',
          'Immutability with const',
        ],
        risks: ['May require scope adjustments'],
        range: { startLine: 1, startColumn: 1, endLine: 1, endColumn: 100 },
      });
    }

    return suggestions;
  }

  private getPythonQuickSuggestions(code: string): RefactoringSuggestion[] {
    const suggestions: RefactoringSuggestion[] = [];

    // Check for long lines
    const lines = code.split('\n');
    const longLines = lines.filter(line => line.length > 88);
    if (longLines.length > 0) {
      suggestions.push({
        id: 'py-line-length',
        type: 'split-long-method',
        title: 'Break Long Lines',
        description: 'Split lines longer than 88 characters',
        severity: 'suggestion',
        confidence: 80,
        impact: 'low',
        originalCode: 'very_long_line_that_exceeds_recommended_length...',
        refactoredCode:
          'split_line_with_proper_breaks\n    .and_continuation()',
        explanation: 'Improves readability and follows PEP 8 guidelines',
        benefits: [
          'Better readability',
          'PEP 8 compliance',
          'Easier code review',
        ],
        risks: ['May affect string literals'],
        range: { startLine: 1, startColumn: 1, endLine: 1, endColumn: 100 },
      });
    }

    return suggestions;
  }

  private getGenericQuickSuggestions(_code: string): RefactoringSuggestion[] {
    return [];
  }

  // Clear all cached responses
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
