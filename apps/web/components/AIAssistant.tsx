/* global TextDecoder, TextEncoder, alert, setInterval, clearInterval, setTimeout, clearTimeout, HTMLDivElement, HTMLStyleElement */
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Card, Stack, Input, Button, Loading } from '@udp/ui';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode?: string;
  fileName?: string;
  editorContent?: string;
  cursorPosition?: { line: number; column: number };
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  selectedCode,
  fileName,
  editorContent,
  cursorPosition,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, systemPrompt?: string) => {
    if (!content.trim() || isLoading) {return;}

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Enhanced context for better AI responses
      const contextInfo = {
        fileName,
        selectedCode,
        cursorPosition,
        editorContent: editorContent?.slice(0, 2000), // First 2000 chars for context
      };

      const enhancedSystemPrompt = `${systemPrompt || 'You are a helpful coding assistant.'} 
      
Context:
- File: ${fileName || 'unknown'}
- Selected code: ${selectedCode ? 'Available' : 'None'}
- Cursor position: ${cursorPosition ? `Line ${cursorPosition.line}, Column ${cursorPosition.column}` : 'Unknown'}
- This is a collaborative coding environment with real-time editing.

Please provide helpful, accurate coding assistance with explanations.`;

      const apiMessages = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      apiMessages.push({ role: 'user', content: content.trim() });

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          system: enhancedSystemPrompt,
          context: contextInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      let accumulatedContent = '';
  // streaming reader loop — intentional constant condition
  // eslint-disable-next-line no-constant-condition
  while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {return;}

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulatedContent += delta;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const explainSelection = () => {
    if (!selectedCode) {return;}
    const prompt = `Explain this code${fileName ? ` from ${fileName}` : ''}:

\`\`\`
${selectedCode}
\`\`\`

Please provide a clear explanation of what this code does, how it works, and any notable patterns or potential improvements.`;
    sendMessage(
      prompt,
      'You are a helpful coding assistant. Explain code clearly and provide insights about best practices.'
    );
  };

  const writeTests = () => {
    if (!selectedCode) {return;}
    const prompt = `Write comprehensive unit tests for this code${fileName ? ` from ${fileName}` : ''}:

\`\`\`
${selectedCode}
\`\`\`

Please include:
- Test setup and teardown
- Happy path tests
- Edge cases and error conditions
- Mock dependencies if needed`;
    sendMessage(
      prompt,
      'You are a helpful coding assistant. Write comprehensive unit tests using popular testing frameworks and best practices.'
    );
  };

  const optimizeCode = () => {
    if (!selectedCode) {return;}
    const prompt = `Optimize and improve this code${fileName ? ` from ${fileName}` : ''}:

\`\`\`
${selectedCode}
\`\`\`

Please suggest:
- Performance improvements
- Code readability enhancements
- Best practice implementations
- Potential bug fixes
- More maintainable patterns`;
    sendMessage(
      prompt,
      'You are a helpful coding assistant. Suggest optimizations and improvements while maintaining functionality and following best practices.'
    );
  };

  const debugCode = () => {
    if (!selectedCode) {return;}
    const prompt = `Help debug this code${fileName ? ` from ${fileName}` : ''}:

\`\`\`
${selectedCode}
\`\`\`

Please help identify:
- Potential bugs or issues
- Runtime errors that might occur
- Logic problems
- Missing error handling
- Debugging strategies`;
    sendMessage(
      prompt,
      'You are a helpful debugging assistant. Analyze code for potential issues and provide debugging guidance.'
    );
  };

  const generateDocumentation = () => {
    if (!selectedCode) {return;}
    const prompt = `Generate documentation for this code${fileName ? ` from ${fileName}` : ''}:

\`\`\`
${selectedCode}
\`\`\`

Please provide:
- JSDoc/documentation comments
- Usage examples
- Parameter descriptions
- Return value documentation
- Any important notes or warnings`;
    sendMessage(
      prompt,
      'You are a helpful documentation assistant. Generate clear, comprehensive documentation for code.'
    );
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='🤖 AI Coding Assistant'
      size='large'
      actions={[
        <Button key='clear' variant='ghost' onClick={clearChat}>
          Clear Chat
        </Button>,
        <Button key='close' variant='secondary' onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Stack gap='medium' style={{ height: '70vh' }}>
        {/* Enhanced Quick Actions */}
        {selectedCode && (
          <Card title='✨ Quick Actions' padding='small'>
            <Stack direction='row' gap='small' wrap>
              <Button size='small' onClick={explainSelection}>
                📖 Explain
              </Button>
              <Button size='small' onClick={writeTests}>
                🧪 Write Tests
              </Button>
              <Button size='small' onClick={optimizeCode}>
                ⚡ Optimize
              </Button>
              <Button size='small' onClick={debugCode}>
                🐛 Debug
              </Button>
              <Button size='small' onClick={generateDocumentation}>
                📝 Document
              </Button>
            </Stack>
          </Card>
        )}

        {/* Context Information */}
        {(fileName || cursorPosition) && (
          <Card title='📍 Context' padding='small'>
            <Stack gap='small'>
              {fileName && (
                <div>
                  <strong>File:</strong> {fileName}
                </div>
              )}
              {cursorPosition && (
                <div>
                  <strong>Cursor:</strong> Line {cursorPosition.line}, Column{' '}
                  {cursorPosition.column}
                </div>
              )}
              {selectedCode && (
                <div>
                  <strong>Selection:</strong> {selectedCode.length} characters
                  selected
                </div>
              )}
            </Stack>
          </Card>
        )}

        {/* Chat Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👋</div>
              <p>
                <strong>Hi! I&apos;m your AI coding assistant.</strong>
              </p>
              <p>
                Ask me anything about your code, request explanations, get help
                with debugging, or use the quick actions above for common tasks!
              </p>
              <div
                style={{ marginTop: '16px', fontSize: '14px', color: '#888' }}
              >
                💡{' '}
                <em>
                  Tip: Select code in the editor to unlock powerful quick
                  actions
                </em>
              </div>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor:
                    message.role === 'user' ? '#e3f2fd' : '#f8f9fa',
                  border: `1px solid ${message.role === 'user' ? '#bbdefb' : '#e9ecef'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: message.role === 'user' ? '#1565c0' : '#424242',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{message.role === 'user' ? '👤' : '🤖'}</span>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: message.content.includes('```')
                      ? "Monaco, 'Courier New', monospace"
                      : 'inherit',
                    lineHeight: '1.5',
                  }}
                >
                  {message.content}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#888',
                    marginTop: '8px',
                    textAlign: 'right',
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <Loading
                text={isTyping ? 'AI is typing...' : 'AI is thinking...'}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Form */}
        <Stack direction='row' gap='small' align='center'>
          <Input
            value={inputValue}
            onChange={setInputValue}
            placeholder='Ask me anything about your code...'
            style={{ flex: 1 }}
            disabled={isLoading}
          />
          <Button
            disabled={!inputValue.trim() || isLoading}
            onClick={() => sendMessage(inputValue)}
          >
            {isLoading ? '...' : 'Send'}
          </Button>
        </Stack>
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
          💡 Click Send to submit your message
        </div>
      </Stack>
    </Modal>
  );
};
