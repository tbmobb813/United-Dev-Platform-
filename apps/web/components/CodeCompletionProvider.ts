// Import monaco types only for TypeScript, not runtime
import type * as Monaco from 'monaco-editor';

export interface CodeSuggestion {
  label: string;
  kind: number; // Use number instead of monaco enum to avoid runtime dependency
  documentation: string;
  insertText: string;
  detail?: string;
}

export class CodeCompletionProvider {
  private static instance: CodeCompletionProvider;
  private monaco: typeof Monaco | null = null;

  private constructor() {}

  public static getInstance(): CodeCompletionProvider {
    if (!CodeCompletionProvider.instance) {
      CodeCompletionProvider.instance = new CodeCompletionProvider();
    }
    return CodeCompletionProvider.instance;
  }

  private async loadMonaco(): Promise<typeof Monaco> {
    if (typeof window === 'undefined') {
      throw new Error('Monaco Editor can only be used in the browser');
    }

    if (!this.monaco) {
      this.monaco = await import('monaco-editor');
    }
    return this.monaco;
  }

  public async registerCompletionProviders() {
    try {
      const monaco = await this.loadMonaco();

      // Common completions with resolved enum values
      const commonCompletions = [
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: 'Log a message to the console',
          insertText: 'console.log(${1:message});',
          detail: 'Console logging',
        },
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Keyword,
          documentation: 'Create a new function',
          insertText:
            'function ${1:functionName}(${2:params}) {\n\t${3:// function body}\n}',
          detail: 'Function declaration',
        },
        {
          label: 'const',
          kind: monaco.languages.CompletionItemKind.Keyword,
          documentation: 'Create a constant variable',
          insertText: 'const ${1:variableName} = ${2:value};',
          detail: 'Constant declaration',
        },
        {
          label: 'useState',
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: 'React hook for managing state',
          insertText:
            'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
          detail: 'React useState hook',
        },
        {
          label: 'useEffect',
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: 'React hook for side effects',
          insertText:
            'useEffect(() => {\n\t${1:// effect code}\n}, [${2:dependencies}]);',
          detail: 'React useEffect hook',
        },
      ];

      // JavaScript/TypeScript completion provider
      const provideCompletionItems = (
        model: Monaco.editor.ITextModel,
        position: Monaco.Position
      ) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: commonCompletions.map(completion => ({
            label: completion.label,
            kind: completion.kind,
            documentation: completion.documentation,
            insertText: completion.insertText,
            detail: completion.detail,
            range: range,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          })),
        };
      };

      monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems,
      });

      monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems,
      });

      console.log('✅ Code completion providers registered');
    } catch (error) {
      console.warn('❌ Could not register code completion providers:', error);
    }
  }

  public async registerHoverProvider() {
    try {
      const monaco = await this.loadMonaco();

      const jsHoverProvider = {
        provideHover: (
          model: Monaco.editor.ITextModel,
          position: Monaco.Position
        ) => {
          const word = model.getWordAtPosition(position);
          if (!word) return null;

          const hoverInfo = this.getHoverInfo(word.word);
          if (!hoverInfo) return null;

          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${hoverInfo.title}**` },
              { value: hoverInfo.description },
            ],
          };
        },
      };

      monaco.languages.registerHoverProvider('javascript', jsHoverProvider);
      monaco.languages.registerHoverProvider('typescript', jsHoverProvider);

      console.log('✅ Hover providers registered');
    } catch (error) {
      console.warn('❌ Could not register hover providers:', error);
    }
  }

  private getHoverInfo(
    word: string
  ): { title: string; description: string } | null {
    const hoverMap: Record<string, { title: string; description: string }> = {
      console: {
        title: 'Console Object',
        description:
          "The console object provides access to the browser's debugging console. Use console.log(), console.error(), etc.",
      },
      useState: {
        title: 'React useState Hook',
        description:
          'A Hook that lets you add React state to function components. Returns a stateful value and a function to update it.',
      },
      useEffect: {
        title: 'React useEffect Hook',
        description:
          'A Hook that lets you perform side effects in function components. Runs after every completed render.',
      },
      function: {
        title: 'Function Declaration',
        description:
          'Declares a function with the specified parameters. Functions are first-class objects in JavaScript.',
      },
      const: {
        title: 'Const Declaration',
        description:
          "Declares a read-only named constant. The value of a constant can't be changed through reassignment.",
      },
    };

    return hoverMap[word] || null;
  }
}

export const codeCompletionService = CodeCompletionProvider.getInstance();
