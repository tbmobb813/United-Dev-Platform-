import React, { useState } from "react";
import { Modal, Card, Button, Input } from "@udp/ui";

// Types for the AI Assistant
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  currentFile?: string;
  selectedCode?: string;
  onCodeInsert?: (codeToInsert: string) => void;
}

// AI Assistant Component
const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  currentFile,
  selectedCode,
  onCodeInsert,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response for now - in real app this would call the AI API
      window.setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I understand you're asking about: "${content}". This is a placeholder response from the AI Assistant package.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("AI request failed:", error);
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Explain Code",
      action: () =>
        selectedCode && sendMessage(`Explain this code: \n\n${selectedCode}`),
    },
    {
      label: "Write Tests",
      action: () =>
        selectedCode &&
        sendMessage(`Write unit tests for: \n\n${selectedCode}`),
    },
    {
      label: "Optimize",
      action: () =>
        selectedCode && sendMessage(`Optimize this code: \n\n${selectedCode}`),
    },
    {
      label: "Add Comments",
      action: () =>
        selectedCode &&
        sendMessage(`Add helpful comments to: \n\n${selectedCode}`),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤖 AI Assistant"
      size="large"
    >
      <div
        style={{ height: "600px", display: "flex", flexDirection: "column" }}
      >
        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            border: "1px solid #e1e5e9",
            borderRadius: "8px",
            marginBottom: "16px",
            backgroundColor: "#f8f9fa",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#6c757d",
                marginTop: "50px",
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
            messages.map((message) => (
              <Card
                key={message.id}
                style={{
                  marginBottom: "12px",
                  backgroundColor:
                    message.role === "user" ? "#e3f2fd" : "#f1f8e9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <strong>
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </strong>
                  <small style={{ color: "#6c757d" }}>
                    {message.timestamp.toLocaleTimeString()}
                  </small>
                </div>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    fontSize: "14px",
                  }}
                >
                  {message.content}
                </div>
                {message.role === "assistant" && onCodeInsert && (
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() => onCodeInsert(message.content)}
                    style={{ marginTop: "8px" }}
                  >
                    Insert Code
                  </Button>
                )}
              </Card>
            ))
          )}
          {isLoading && (
            <Card style={{ backgroundColor: "#f1f8e9" }}>
              <div>🤔 AI Assistant is thinking...</div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        {selectedCode && (
          <Card title="Quick Actions" style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="small"
                  onClick={action.action}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            <div
              style={{ marginTop: "8px", fontSize: "12px", color: "#6c757d" }}
            >
              Selected: {selectedCode.substring(0, 50)}...
            </div>
          </Card>
        )}

        {/* Input Area */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Input
            value={input}
            onChange={setInput}
            placeholder="Ask me anything about your code..."
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
