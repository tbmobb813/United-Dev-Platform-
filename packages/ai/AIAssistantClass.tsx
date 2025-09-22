import React from 'react';

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
  onCodeInsert?: (code: string) => void;
  aiManager?: any;
}

interface AIAssistantState {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  streamingContent: string;
}

// Minimal AI Assistant using class component to avoid hooks
class AIAssistant extends React.Component<AIAssistantProps, AIAssistantState> {
  constructor(props: AIAssistantProps) {
    super(props);
    this.state = {
      messages: [],
      input: '',
      isLoading: false,
      streamingContent: '',
    };
  }

  sendMessage = async (content: string, _intent: string = 'chat') => {
    if (!content.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    this.setState({
      messages: [...this.state.messages, userMessage],
      input: '',
      isLoading: true,
      streamingContent: '',
    });

    // Simulate AI response
    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about: "${content}". This is a placeholder response from the AI Assistant. To enable real AI responses, please configure your API keys in the settings.`,
        timestamp: new Date(),
      };

      this.setState({
        messages: [...this.state.messages, assistantMessage],
        isLoading: false,
      });
    }, 1000);
  };

  render() {
    const { isOpen, onClose, currentFile, selectedCode, onCodeInsert } =
      this.props;
    const { messages, input, isLoading } = this.state;

    if (!isOpen) {
      return null;
    }

    const quickActions = [
      {
        label: 'Explain Code',
        action: () =>
          selectedCode &&
          this.sendMessage(`Explain this code: \n\n${selectedCode}`, 'explain'),
      },
      {
        label: 'Write Tests',
        action: () =>
          selectedCode &&
          this.sendMessage(`Write unit tests for: \n\n${selectedCode}`, 'test'),
      },
      {
        label: 'Optimize',
        action: () =>
          selectedCode &&
          this.sendMessage(
            `Optimize this code: \n\n${selectedCode}`,
            'optimize'
          ),
      },
      {
        label: 'Debug Issues',
        action: () =>
          selectedCode &&
          this.sendMessage(
            `Debug and fix issues in: \n\n${selectedCode}`,
            'debug'
          ),
      },
    ];

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '0',
            width: '90%',
            maxWidth: '900px',
            height: '80vh',
            maxHeight: '700px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e1e5e9',
              flexShrink: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              🤖 AI Assistant
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ×
            </button>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 24px',
              minHeight: 0,
            }}
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
                minHeight: 0,
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
                  <h3>🤖 AI Assistant Ready</h3>
                  <p>
                    Ask me anything about your code using the input field below,
                    or use the quick actions if you have code selected.
                  </p>
                  {currentFile && (
                    <p>
                      <strong>Current file:</strong> {currentFile}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '12px',
                      backgroundColor: '#e7f3ff',
                      borderRadius: '8px',
                      border: '1px solid #b3d9ff',
                    }}
                  >
                    <p
                      style={{ margin: 0, fontSize: '14px', color: '#0066cc' }}
                    >
                      💡 <strong>Tip:</strong> Type your question in the input
                      field at the bottom of this window!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '12px',
                      padding: '16px',
                      borderRadius: '8px',
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
                        fontSize: '14px',
                        lineHeight: '1.4',
                      }}
                    >
                      {message.content}
                    </div>
                    {message.role === 'assistant' && onCodeInsert && (
                      <button
                        onClick={() => onCodeInsert(message.content)}
                        style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Insert Code
                      </button>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f8e9',
                  }}
                >
                  <div>🤔 AI Assistant is thinking...</div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {selectedCode && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <h4 style={{ margin: '0 0 8px 0' }}>Quick Actions</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quickActions.map(action => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      disabled={isLoading}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6c757d',
                  }}
                >
                  Selected: {selectedCode.substring(0, 50)}...
                </div>
              </div>
            )}

            {/* Input Area - Always visible at bottom */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexShrink: 0,
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e1e5e9',
                borderRadius: '0 0 8px 8px',
                marginTop: 'auto',
              }}
            >
              <input
                value={input}
                onChange={e => this.setState({ input: e.target.value })}
                placeholder='Ask me anything about your code...'
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#007bff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e1e5e9';
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage(input);
                  }
                }}
              />
              <button
                onClick={() => this.sendMessage(input)}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor:
                    !input.trim() || isLoading ? '#ccc' : '#007bff',
                  color: 'white',
                  cursor:
                    !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  minWidth: '80px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => {
                  if (!(!input.trim() || isLoading)) {
                    e.target.style.backgroundColor = '#0056b3';
                  }
                }}
                onMouseLeave={e => {
                  if (!(!input.trim() || isLoading)) {
                    e.target.style.backgroundColor = '#007bff';
                  }
                }}
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AIAssistant;
