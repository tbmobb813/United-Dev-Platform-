// AI Service layer only
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
export { AnthropicService } from './services/AnthropicService';
export { OllamaService } from './services/OllamaService';
export { OpenAIService } from './services/OpenAIService';
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
