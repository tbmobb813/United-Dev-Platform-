import * as monaco from "monaco-editor";

export interface CodeSuggestion {
  label: string;
  kind: monaco.languages.CompletionItemKind;
  documentation: string;
  insertText: string;
  detail?: string;
}

// Common JavaScript/TypeScript code completions
const commonCompletions: CodeSuggestion[] = [
  {
    label: "console.log",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "Log a message to the console",
    insertText: "console.log(${1:message});",
    detail: "Console logging",
  },
  {
    label: "function",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Create a new function",
    insertText:
      "function ${1:functionName}(${2:params}) {\n\t${3:// function body}\n}",
    detail: "Function declaration",
  },
  {
    label: "const",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Create a constant variable",
    insertText: "const ${1:variableName} = ${2:value};",
    detail: "Constant declaration",
  },
  {
    label: "let",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Create a variable",
    insertText: "let ${1:variableName} = ${2:value};",
    detail: "Variable declaration",
  },
  {
    label: "if",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Conditional statement",
    insertText: "if (${1:condition}) {\n\t${2:// code}\n}",
    detail: "If statement",
  },
  {
    label: "for",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "For loop",
    insertText:
      "for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}",
    detail: "For loop",
  },
  {
    label: "forEach",
    kind: monaco.languages.CompletionItemKind.Method,
    documentation: "Execute a function for each array element",
    insertText: "forEach((${1:item}, ${2:index}) => {\n\t${3:// code}\n})",
    detail: "Array forEach method",
  },
  {
    label: "map",
    kind: monaco.languages.CompletionItemKind.Method,
    documentation:
      "Create a new array with the results of calling a function for every array element",
    insertText: "map((${1:item}, ${2:index}) => {\n\treturn ${3:item};\n})",
    detail: "Array map method",
  },
  {
    label: "filter",
    kind: monaco.languages.CompletionItemKind.Method,
    documentation:
      "Create a new array with all elements that pass a test function",
    insertText:
      "filter((${1:item}, ${2:index}) => {\n\treturn ${3:condition};\n})",
    detail: "Array filter method",
  },
  {
    label: "reduce",
    kind: monaco.languages.CompletionItemKind.Method,
    documentation:
      "Execute a reducer function on each element, resulting in a single output value",
    insertText:
      "reduce((${1:accumulator}, ${2:currentValue}) => {\n\treturn ${3:accumulator};\n}, ${4:initialValue})",
    detail: "Array reduce method",
  },
  {
    label: "async function",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "Create an async function",
    insertText:
      "async function ${1:functionName}(${2:params}) {\n\t${3:// async code}\n\treturn ${4:result};\n}",
    detail: "Async function declaration",
  },
  {
    label: "await",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Wait for a Promise to resolve",
    insertText: "await ${1:promise}",
    detail: "Await expression",
  },
  {
    label: "try-catch",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Try-catch error handling block",
    insertText:
      "try {\n\t${1:// code that might throw}\n} catch (${2:error}) {\n\t${3:// handle error}\n\tconsole.error(${2:error});\n}",
    detail: "Error handling",
  },
  {
    label: "import",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Import a module",
    insertText: "import { ${1:exports} } from '${2:module}';",
    detail: "ES6 import",
  },
  {
    label: "export",
    kind: monaco.languages.CompletionItemKind.Keyword,
    documentation: "Export from a module",
    insertText: "export { ${1:exports} };",
    detail: "ES6 export",
  },
];

// React-specific completions
const reactCompletions: CodeSuggestion[] = [
  {
    label: "useState",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "React hook for managing state",
    insertText:
      "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});",
    detail: "React useState hook",
  },
  {
    label: "useEffect",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "React hook for side effects",
    insertText:
      "useEffect(() => {\n\t${1:// effect code}\n\t${2:// cleanup (optional)}\n\treturn () => {\n\t\t${3:// cleanup code}\n\t};\n}, [${4:dependencies}]);",
    detail: "React useEffect hook",
  },
  {
    label: "useContext",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "React hook for consuming context",
    insertText: "const ${1:contextValue} = useContext(${2:Context});",
    detail: "React useContext hook",
  },
  {
    label: "useCallback",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "React hook for memoizing callbacks",
    insertText:
      "const ${1:memoizedCallback} = useCallback(() => {\n\t${2:// callback code}\n}, [${3:dependencies}]);",
    detail: "React useCallback hook",
  },
  {
    label: "useMemo",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "React hook for memoizing values",
    insertText:
      "const ${1:memoizedValue} = useMemo(() => {\n\treturn ${2:computation};\n}, [${3:dependencies}]);",
    detail: "React useMemo hook",
  },
  {
    label: "React Component",
    kind: monaco.languages.CompletionItemKind.Class,
    documentation: "Create a React functional component",
    insertText:
      "const ${1:ComponentName} = (${2:props}) => {\n\treturn (\n\t\t<div>\n\t\t\t${3:// component content}\n\t\t</div>\n\t);\n};",
    detail: "React functional component",
  },
];

// Markdown-specific completions
const markdownCompletions: CodeSuggestion[] = [
  {
    label: "# Heading 1",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a level 1 heading",
    insertText: "# ${1:Heading}",
    detail: "Markdown heading",
  },
  {
    label: "## Heading 2",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a level 2 heading",
    insertText: "## ${1:Heading}",
    detail: "Markdown heading",
  },
  {
    label: "```code block",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a code block",
    insertText: "```${1:language}\n${2:code}\n```",
    detail: "Markdown code block",
  },
  {
    label: "**bold**",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Bold text",
    insertText: "**${1:bold text}**",
    detail: "Markdown bold",
  },
  {
    label: "*italic*",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Italic text",
    insertText: "*${1:italic text}*",
    detail: "Markdown italic",
  },
  {
    label: "[link](url)",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a link",
    insertText: "[${1:link text}](${2:url})",
    detail: "Markdown link",
  },
  {
    label: "- list item",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a list item",
    insertText: "- ${1:list item}",
    detail: "Markdown list",
  },
  {
    label: "1. numbered list",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a numbered list item",
    insertText: "1. ${1:list item}",
    detail: "Markdown numbered list",
  },
  {
    label: "> blockquote",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a blockquote",
    insertText: "> ${1:quoted text}",
    detail: "Markdown blockquote",
  },
  {
    label: "| table |",
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: "Create a table",
    insertText:
      "| ${1:Header 1} | ${2:Header 2} |\n| --- | --- |\n| ${3:Cell 1} | ${4:Cell 2} |",
    detail: "Markdown table",
  },
];

export class CodeCompletionProvider {
  private static instance: CodeCompletionProvider;

  private constructor() {}

  public static getInstance(): CodeCompletionProvider {
    if (!CodeCompletionProvider.instance) {
      CodeCompletionProvider.instance = new CodeCompletionProvider();
    }
    return CodeCompletionProvider.instance;
  }

  public registerCompletionProviders() {
    // JavaScript/TypeScript completion provider
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: [...commonCompletions, ...reactCompletions].map(
            (completion) => ({
              label: completion.label,
              kind: completion.kind,
              documentation: completion.documentation,
              insertText: completion.insertText,
              detail: completion.detail,
              range: range,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            })
          ),
        };
      },
    });

    // TypeScript completion provider
    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: [...commonCompletions, ...reactCompletions].map(
            (completion) => ({
              label: completion.label,
              kind: completion.kind,
              documentation: completion.documentation,
              insertText: completion.insertText,
              detail: completion.detail,
              range: range,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            })
          ),
        };
      },
    });

    // Markdown completion provider
    monaco.languages.registerCompletionItemProvider("markdown", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: markdownCompletions.map((completion) => ({
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
      },
    });

    console.log("✅ Code completion providers registered");
  }

  public registerHoverProvider() {
    // JavaScript/TypeScript hover provider
    const jsHoverProvider = {
      provideHover: (
        model: monaco.editor.ITextModel,
        position: monaco.Position
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

    monaco.languages.registerHoverProvider("javascript", jsHoverProvider);
    monaco.languages.registerHoverProvider("typescript", jsHoverProvider);

    console.log("✅ Hover providers registered");
  }

  private getHoverInfo(
    word: string
  ): { title: string; description: string } | null {
    const hoverMap: Record<string, { title: string; description: string }> = {
      console: {
        title: "Console Object",
        description:
          "The console object provides access to the browser's debugging console. Use console.log(), console.error(), etc.",
      },
      useState: {
        title: "React useState Hook",
        description:
          "A Hook that lets you add React state to function components. Returns a stateful value and a function to update it.",
      },
      useEffect: {
        title: "React useEffect Hook",
        description:
          "A Hook that lets you perform side effects in function components. Runs after every completed render.",
      },
      async: {
        title: "Async Function",
        description:
          "The async keyword is used to declare asynchronous functions that return Promises.",
      },
      await: {
        title: "Await Expression",
        description:
          "The await operator is used to wait for a Promise to resolve inside an async function.",
      },
      function: {
        title: "Function Declaration",
        description:
          "Declares a function with the specified parameters. Functions are first-class objects in JavaScript.",
      },
      const: {
        title: "Const Declaration",
        description:
          "Declares a read-only named constant. The value of a constant can't be changed through reassignment.",
      },
      let: {
        title: "Let Declaration",
        description:
          "Declares a block-scoped local variable, optionally initializing it to a value.",
      },
      var: {
        title: "Var Declaration",
        description:
          "Declares a function-scoped or globally-scoped variable, optionally initializing it to a value.",
      },
    };

    return hoverMap[word] || null;
  }

  public registerCodeActionProvider() {
    // Quick fix provider
    monaco.languages.registerCodeActionProvider("javascript", {
      provideCodeActions: (model, range) => {
        const actions: monaco.languages.CodeAction[] = [];

        // Add console.log quick fix
        actions.push({
          title: "Add console.log",
          kind: "quickfix",
          edit: {
            edits: [
              {
                resource: model.uri,
                versionId: model.getVersionId(),
                textEdit: {
                  range: range,
                  text: `console.log('${model.getValueInRange(range)}');`,
                },
              },
            ],
          },
        });

        // Add try-catch wrapper
        actions.push({
          title: "Wrap in try-catch",
          kind: "refactor",
          edit: {
            edits: [
              {
                resource: model.uri,
                versionId: model.getVersionId(),
                textEdit: {
                  range: range,
                  text: `try {\n\t${model.getValueInRange(range)}\n} catch (error) {\n\tconsole.error(error);\n}`,
                },
              },
            ],
          },
        });

        return {
          actions: actions,
          dispose: () => {},
        };
      },
    });

    console.log("✅ Code action providers registered");
  }
}

export const codeCompletionService = CodeCompletionProvider.getInstance();
