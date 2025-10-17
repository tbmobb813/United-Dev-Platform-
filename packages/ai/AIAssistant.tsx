/** @jsxImportSource react */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Card, Button, Input } from '@udp/ui';
import { AIManager, CodeContext } from './AIManager';

// Types for the AI Assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  currentFile?: string;
  selectedCode?: string;
  // @ts-ignore - parameter name needed for type definition

  onCodeInsert?: (code: string) => void;
  aiManager?: AIManager; // Optional AI manager instance
}

// AI Assistant Component
const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  currentFile,
  selectedCode,
  onCodeInsert,
  aiManager,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<React.ElementRef<'div'>>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const getCodeContext = (): CodeContext => {
    const fileExtension = currentFile?.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      css: 'css',
      html: 'html',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
    };

    return {
      fileName: currentFile,
      language: fileExtension
        ? languageMap[fileExtension] || fileExtension
        : undefined,
      selectedCode: selectedCode,
    };
  };

  // Normalize unknown errors into a readable message for UI
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    try {
      return JSON.stringify(error ?? 'AI request failed');
    } catch {
      return 'AI request failed';
    }
  };

  const sendMessage = async (
    content: string,
    intent:
      | 'chat'
      | 'explain'
      | 'generate'
      | 'debug'
      | 'optimize'
      | 'test' = 'chat'
  ) => {
    if (!content.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Create a placeholder assistant message for streaming
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      if (aiManager && aiManager.isReady()) {
        const context = getCodeContext();

        const response = await aiManager.chat(
          content,
          context,
          intent,
          (chunk: string) => {
            setStreamingContent(prev => prev + chunk);
          }
        );

        // Update the final message
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: response.content, isStreaming: false }
              : msg
          )
        );
        setStreamingContent('');
      } else {
        // Fallback to placeholder if no AI manager
        const fallbackResponse = await simulateFallbackResponse(
          content,
          intent
        );
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: fallbackResponse, isStreaming: false }
              : msg
          )
        );
      }
    } catch (error: unknown) {
      // Error logging removed to comply with linting rules
      const errorMessage = getErrorMessage(error);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: `❌ Error: ${errorMessage}\n\nPlease check your AI configuration and try again.`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const simulateFallbackResponse = async (
    content: string,
    intent: string
  ): Promise<string> => {
    return new Promise(resolve => {
      window.setTimeout(() => {
        const responses = {
          explain: `I'd love to explain this code for you! However, I need to be connected to an AI service (like OpenAI or Anthropic) to provide detailed explanations.\n\n**What I would do:**\n- Analyze the code structure and logic\n- Explain each part in detail\n- Identify patterns and best practices\n- Suggest improvements\n\n**To enable AI features:**\n1. Add your API key in settings\n2. Select an AI provider (OpenAI/Anthropic)\n3. Try again!`,

          generate: `I'm ready to help generate code! But first, I need to be connected to an AI service.\n\n**What I would generate:**\n- Clean, well-structured code based on your request\n- Proper error handling\n- Best practices and conventions\n- Helpful comments\n\n**Setup needed:**\nPlease configure an AI provider in the settings to unlock code generation.`,

          debug: `I can help debug this code once connected to an AI service!\n\n**Debugging approach I'd take:**\n- Identify potential issues and bugs\n- Explain why problems occur\n- Provide specific fixes\n- Suggest preventive measures\n\nPlease set up AI integration to get real debugging assistance.`,

          optimize: `I'd love to optimize this code for you!\n\n**Optimization areas I'd focus on:**\n- Performance improvements\n- Memory efficiency\n- Code readability\n- Best practices\n\nTo get real optimization suggestions, please configure an AI provider.`,

          test: `I can generate comprehensive tests once connected to an AI service!\n\n**Test coverage I'd provide:**\n- Unit tests for main functionality\n- Edge cases and error scenarios\n- Integration test suggestions\n- Testing best practices\n\nConfigure AI integration to generate real test code.`,

          chat: `Hello! I'm your AI assistant, ready to help with coding tasks.\n\n**Current status:** Not connected to AI service\n\n**What I can do once configured:**\n- Explain code in detail\n- Generate code from descriptions\n- Debug and fix issues\n- Optimize performance\n- Write comprehensive tests\n- Answer development questions\n\n**To get started:** Add your AI provider credentials in the settings.\n\nFor now, I can still help with basic questions about your request: "${content}"`,
        };

        resolve(responses[intent as keyof typeof responses] || responses.chat);
      }, 800);
    });
  };

  const quickActions = [
    {
      label: 'Explain Code',
      action: () =>
        selectedCode &&
        sendMessage(`Explain this code: \n\n${selectedCode}`, 'explain'),
    },
    {
      label: 'Write Tests',
      action: () =>
        selectedCode &&
        sendMessage(`Write unit tests for: \n\n${selectedCode}`, 'test'),
    },
    {
      label: 'Optimize',
      action: () =>
        selectedCode &&
        sendMessage(`Optimize this code: \n\n${selectedCode}`, 'optimize'),
    },
    {
      label: 'Debug Issues',
      action: () =>
        selectedCode &&
        sendMessage(`Debug and fix issues in: \n\n${selectedCode}`, 'debug'),
    },
    {
      label: 'Generate Code',
      action: () =>
        sendMessage(`Generate code based on the current context`, 'generate'),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'🤖 AI Assistant'}
      size={'large'}
    >
      {/* @ts-ignore */}
      <div
        style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: '#f8f9fa',
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#6c757d',
                marginTop: '50px',
              }}
            >
              <h3>AI Assistant Ready</h3>
              <p>
                Ask me anything about your code or use the quick actions below.
              </p>
              {currentFile && (
                <p>
                  <strong>Current file:</strong> {currentFile}
                </p>
              )}
            </div>
          ) : (
            messages.map(message => (
              <Card
                key={message.id}
                style={{
                  marginBottom: '12px',
                  backgroundColor:
                    message.role === 'user' ? '#e3f2fd' : '#f1f8e9',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <strong>
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </strong>
                  <small style={{ color: '#6c757d' }}>
                    {message.timestamp.toLocaleTimeString()}
                  </small>
                </div>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  }}
                >
                  {message.content}
                  {message.isStreaming && streamingContent && (
                    <span style={{ backgroundColor: '#fff3cd' }}>
                      {streamingContent}
                    </span>
                  )}
                </div>
                {message.role === 'assistant' && onCodeInsert && (
                  <Button
                    size='small'
                    variant='outline'
                    onClick={() => onCodeInsert(message.content)}
                    style={{ marginTop: '8px' }}
                  >
                    Insert Code
                  </Button>
                )}
              </Card>
            ))
          )}
          {isLoading && (
            <Card style={{ backgroundColor: '#f1f8e9' }}>
              <div>🤔 AI Assistant is thinking...</div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {selectedCode && (
          <Card title='Quick Actions' style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickActions.map(action => (
                <Button
                  key={action.label}
                  variant='outline'
                  size='small'
                  onClick={action.action}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            <div
              style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}
            >
              Selected: {selectedCode.substring(0, 50)}...
            </div>
          </Card>
        )}

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            value={input}
            onChange={setInput}
            placeholder='Ask me anything about your code...'
            style={{ flex: 1 }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIAssistant;
