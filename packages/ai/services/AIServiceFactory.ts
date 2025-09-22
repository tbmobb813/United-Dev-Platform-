import { AIService, AIServiceConfig } from './AIService';
import { OpenAIService } from './OpenAIService';
import { AnthropicService } from './AnthropicService';

export class AIServiceFactory {
  private static services: Map<string, AIService> = new Map();

  static createService(config: AIServiceConfig): AIService {
    const key = `${config.provider}-${config.model}`;

    // Return existing service if available
    if (this.services.has(key)) {
      return this.services.get(key)!;
    }

    let service: AIService;

    switch (config.provider) {
      case 'openai':
        service = new OpenAIService(config);
        break;
      case 'anthropic':
        service = new AnthropicService(config);
        break;
      case 'local':
        // For future local model support (Ollama, etc.)
        throw new Error('Local AI provider not yet implemented');
      case 'ollama':
        // For future Ollama support
        throw new Error('Ollama provider not yet implemented');
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }

    this.services.set(key, service);
    return service;
  }

  static clearCache(): void {
    this.services.clear();
  }

  static getAvailableProviders(): Array<{
    id: string;
    name: string;
    description: string;
    requiresApiKey: boolean;
    models: string[];
  }> {
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4, GPT-3.5 Turbo models from OpenAI',
        requiresApiKey: true,
        models: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'],
      },
      {
        id: 'anthropic',
        name: 'Anthropic Claude',
        description: 'Claude 3 Opus, Sonnet, and Haiku models',
        requiresApiKey: true,
        models: [
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307',
        ],
      },
      // Future providers can be added here
    ];
  }

  static validateConfig(config: AIServiceConfig): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.provider) {
      errors.push('Provider is required');
    }

    if (!config.model) {
      errors.push('Model is required');
    }

    if (
      (config.provider === 'openai' || config.provider === 'anthropic') &&
      !config.apiKey
    ) {
      errors.push(`API key is required for ${config.provider}`);
    }

    if (
      config.maxTokens &&
      (config.maxTokens < 1 || config.maxTokens > 32000)
    ) {
      errors.push('Max tokens must be between 1 and 32000');
    }

    if (
      config.temperature &&
      (config.temperature < 0 || config.temperature > 2)
    ) {
      errors.push('Temperature must be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Default configurations for different use cases
export const DEFAULT_CONFIGS = {
  development: {
    provider: 'openai' as const,
    model: 'gpt-3.5-turbo',
    maxTokens: 1500,
    temperature: 0.7,
  },
  production: {
    provider: 'openai' as const,
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.5,
  },
  creative: {
    provider: 'anthropic' as const,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 2000,
    temperature: 0.8,
  },
  fast: {
    provider: 'openai' as const,
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.3,
  },
} as const;
