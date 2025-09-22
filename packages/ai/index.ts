export type AITool =
  | 'explainFile'
  | 'suggestRefactor'
  | 'createScreen'
  | 'mapParity'
  | 'writeTest';

export type AIRequest = {
  tool: AITool;
  repoId: string;
  filePath?: string;
  selection?: { from: number; to: number };
  prompt?: string;
};

export const prompts = {
  explainFile: `You are a senior engineer. Explain the file succinctly...`,
  suggestRefactor: `Propose a safe refactor with a unified diff...`,
};

// Main AI Assistant component (Class component to avoid React hooks issues)
export { default as AIAssistant } from './AIAssistantClass';
export type { AIAssistantProps, ChatMessage } from './AIAssistantClass';

// AI Service layer
export { AIManager } from './AIManager';
export type { AIManagerConfig, CodeContext } from './AIManager';
export { AIService } from './services/AIService';
export type {
  AIMessage,
  AIProvider,
  AIResponse,
  AIServiceConfig,
} from './services/AIService';
export { AIServiceFactory, DEFAULT_CONFIGS } from './services/AIServiceFactory';

// Specific AI service implementations
export { AnthropicService } from './services/AnthropicService';
export { OllamaService } from './services/OllamaService';
export { OpenAIService } from './services/OpenAIService';

// AI-powered development tools
export { CodeCompletionProvider } from './services/CodeCompletionProvider';
export type {
  CodeCompletionRequest,
  CodeCompletionResponse,
  CodeSuggestion,
} from './services/CodeCompletionProvider';

export { RefactoringProvider } from './services/RefactoringProvider';
export type {
  CodeStyle,
  RefactoringRequest,
  RefactoringResponse,
  RefactoringSuggestion,
  RefactoringType,
} from './services/RefactoringProvider';

export { ContextAwareAssistant } from './services/ContextAwareAssistant';
export type {
  ActionSuggestion,
  AssistantTask,
  CodebaseContext,
  CodeExample,
  CodePattern,
  ContextualQuery,
  ContextualResponse,
  FileNode,
  QueryScope,
} from './services/ContextAwareAssistant';
