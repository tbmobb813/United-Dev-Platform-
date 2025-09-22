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
export type { ChatMessage, AIAssistantProps } from './AIAssistantClass';

// AI Service layer
export { AIManager } from './AIManager';
export type { CodeContext, AIManagerConfig } from './AIManager';
export { AIServiceFactory, DEFAULT_CONFIGS } from './services/AIServiceFactory';
export { AIService } from './services/AIService';
export type {
  AIMessage,
  AIResponse,
  AIServiceConfig,
  AIProvider,
} from './services/AIService';

// Specific AI service implementations
export { OpenAIService } from './services/OpenAIService';
export { AnthropicService } from './services/AnthropicService';
