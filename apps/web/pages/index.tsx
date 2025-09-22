import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Input,
  Card,
  Stack,
  Loading,
  FileManager,
  useKeyboardShortcuts,
  commonShortcuts,
  ShortcutsHelp,
  Settings,
  CollaborationPanel,
} from "@udp/ui";
import { AIAssistant, AIManager } from "@udp/ai";
import { codeCompletionService } from "../components/CodeCompletionProvider";

// Dynamic imports for client-side only components
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Loading text="Loading editor..." />,
});

const QRCode = dynamic(() => import("qrcode.react"), {
  ssr: false,
  loading: () => <Loading text="Loading QR code..." />,
});

function generateColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const room = (router.query.room as string) || "default-room";
  const docName = (router.query.doc as string) || "main-document";
  const [file, setFile] = useState("/README.md");
  const [roomInput, setRoomInput] = useState(room);
  const [docInput, setDocInput] = useState(docName);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [fileManagerMode, setFileManagerMode] = useState<
    "open" | "save" | "create"
  >("open");
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  // AI Manager for real AI integration
  const [aiManager, setAiManager] = useState<AIManager | null>(null);

  // Initialize AI Manager when component mounts
  useEffect(() => {
    // For now, create AI manager without API keys (will use fallback responses)
    // In a real app, these would come from user settings/environment variables
    try {
      const manager = new AIManager({
        defaultProvider: "openai",
        apiKeys: {
          // No API keys provided - will trigger fallback responses
        },
        enableStreaming: true,
      });
      setAiManager(manager);
    } catch (error) {
      console.warn("AI Manager initialization failed:", error);
      // Component will work without AI manager (shows fallback responses)
    }
  }, []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Generate both mobile app deeplink and fallback web URL
  const webUrl = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}?room=${encodeURIComponent(room)}&doc=${encodeURIComponent(docName)}`;
  const deeplink = `udp://open?repo=demo&file=${encodeURIComponent(
    file
  )}&cursor=1,1&room=${encodeURIComponent(room)}&doc=${encodeURIComponent(docName)}&fallback=${encodeURIComponent(webUrl)}`;

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const editorRef = useRef<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);
  const ignoreRef = useRef(false);
  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      color: string;
      cursor?: { line: number; column: number };
    }[]
  >([]);
  const [userId] = useState(() => uuidv4().substring(0, 5));

  useEffect(() => {
    setIsClient(true);
    const storedName =
      typeof window !== "undefined" ? localStorage.getItem("userName") : null;
    if (!storedName) {
      router.push("/login");
    } else {
      setUserName(storedName);
    }
  }, [router]);

  useEffect(() => {
    if (!userName) return;

    try {
      const docId = `${room}-${docName}`;
      const doc = new Y.Doc();

      const provider = new WebsocketProvider(
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3030",
        docId,
        doc
      );

      // Add error handling for WebSocket
      provider.on("status", (event: { status: string }) => {
        console.log("WebSocket status:", event.status);
      });

      provider.on("connection-error", (error: Error) => {
        console.error("WebSocket connection error:", error);
      });

      const ytext = doc.getText(docName);
      const awareness = provider.awareness;

      // Set initial content if document is empty
      if (ytext.length === 0) {
        ytext.insert(
          0,
          `# ${docName}\n\nCollaborative document for room: ${room}\nDocument: ${docName}\n\nType here and open the mobile app to test handoff.`
        );
      }

      const handleChange = () => {
        if (!awarenessRef.current) return;
        try {
          const userStates = awarenessRef.current.getStates();
          const userList = Array.from(userStates.values())
            .map(
              (state: {
                user?: {
                  id: string;
                  name: string;
                  color: string;
                  cursor?: { line: number; column: number };
                };
              }) => state.user
            )
            .filter(
              (
                user
              ): user is {
                id: string;
                name: string;
                color: string;
                cursor?: { line: number; column: number };
              } => Boolean(user && user.id && user.name && user.color)
            )
            .map((user) => ({
              id: String(user.id),
              name: String(user.name),
              color: String(user.color),
              cursor: user.cursor,
            }));
          setUsers(userList);

          // Update cursor decorations in editor
          if (editorRef.current) {
            updateCursorDecorations(userList.filter((u) => u.cursor));
          }
        } catch (error) {
          console.error("Error updating user list:", error);
          setUsers([]);
        }
      };

      awareness.setLocalStateField("user", {
        id: userId,
        name: userName,
        color: generateColor(),
      });

      awareness.on("change", handleChange);
      handleChange();

      ydocRef.current = doc;
      providerRef.current = provider;
      ytextRef.current = ytext;
      awarenessRef.current = awareness;

      return () => {
        awareness.off("change", handleChange);
        provider.destroy();
        doc.destroy();
      };
    } catch (error) {
      console.error("Error setting up Yjs:", error);
    }
  }, [room, docName, userName, userId]);

  const updateCursorDecorations = (
    usersWithCursors: {
      id: string;
      name: string;
      color: string;
      cursor: { line: number; column: number };
    }[]
  ) => {
    if (!editorRef.current || typeof window === "undefined") return;

    try {
      const decorations = usersWithCursors.map((user) => ({
        range: {
          startLineNumber: user.cursor.line,
          startColumn: user.cursor.column,
          endLineNumber: user.cursor.line,
          endColumn: user.cursor.column + 1,
        },
        options: {
          className: `cursor-${user.id}`,
          beforeContentClassName: `cursor-label-${user.id}`,
          stickiness: 1,
        },
      }));

      editorRef.current.deltaDecorations([], decorations);

      // Add dynamic styles for cursors
      const styleId = "user-cursor-styles";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const styles = usersWithCursors
        .map(
          (user) => `
        .cursor-${user.id} {
          border-left: 2px solid ${user.color} !important;
        }
        .cursor-label-${user.id}::before {
          content: "${user.name}";
          background: ${user.color};
          color: white;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 11px;
          position: absolute;
          top: -20px;
          white-space: nowrap;
          z-index: 1000;
        }
      `
        )
        .join("\n");

      styleElement.textContent = styles;
    } catch (error) {
      console.warn("Failed to update cursor decorations:", error);
    }
  };

  const handleEditorDidMount = async (
    editor: import("monaco-editor").editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (!model || !ytextRef.current) return;

    // Configure editor options
    editor.updateOptions({
      wordWrap: "on",
      minimap: { enabled: false },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      suggestSelection: "first",
      acceptSuggestionOnEnter: "on",
      hover: {
        enabled: true,
        delay: 300,
      },
      selectionHighlight: true,
      occurrencesHighlight: "singleFile",
      renderLineHighlight: "gutter",
      smoothScrolling: true,
      cursorSmoothCaretAnimation: "on",
    });

    model.setValue(ytextRef.current.toString());

    // Initialize code completion providers
    try {
      await codeCompletionService.registerCompletionProviders();
      await codeCompletionService.registerHoverProvider();
      console.log("✅ Code completion initialized");
    } catch (error) {
      console.warn("Failed to initialize code completion:", error);
    }

    const yObserver = () => {
      if (!ytextRef.current || ignoreRef.current) return;
      ignoreRef.current = true;
      model.setValue(ytextRef.current.toString());
      ignoreRef.current = false;
    };
    ytextRef.current.observe(yObserver);

    const disposable = editor.onDidChangeModelContent(() => {
      if (!ytextRef.current || ignoreRef.current) return;
      ignoreRef.current = true;
      const val = model.getValue();
      ytextRef.current.doc?.transact(() => {
        ytextRef.current!.delete(0, ytextRef.current!.length);
        ytextRef.current!.insert(0, val);
      });
      ignoreRef.current = false;
    });

    // Track cursor position changes
    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      if (!awarenessRef.current || ignoreRef.current) return;

      const position = e.position;
      awarenessRef.current.setLocalStateField("user", {
        ...awarenessRef.current.getLocalState()?.user,
        cursor: {
          line: position.lineNumber,
          column: position.column,
        },
      });
    });

    // Track text selection for AI assistant
    const selectionDisposable = editor.onDidChangeCursorSelection((e) => {
      if (!e.selection.isEmpty()) {
        const selectedText = model.getValueInRange(e.selection);
        if (selectedText) {
          setSelectedCode(selectedText);
        }
      } else {
        setSelectedCode("");
      }
    });

    editor.onDidDispose(() => {
      if (ytextRef.current) ytextRef.current.unobserve(yObserver);
      disposable.dispose();
      cursorDisposable.dispose();
      selectionDisposable.dispose();
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const handleFileSelect = (filePath: string) => {
    setFile(filePath);
    console.log("Opening file:", filePath);
  };

  const handleFileSave = (filePath: string, content: string) => {
    console.log("Saving file:", filePath, "with content:", content);
    // Here you would implement actual file saving logic
  };

  const handleFileCreate = (filePath: string) => {
    setFile(filePath);
    console.log("Creating new file:", filePath);
    // Here you would implement actual file creation logic
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...commonShortcuts.SAVE,
      action: () => {
        console.log("Save shortcut triggered");
        // Implement save logic here
      },
    },
    {
      ...commonShortcuts.OPEN,
      action: () => {
        setFileManagerMode("open");
        setIsFileManagerOpen(true);
      },
    },
    {
      ...commonShortcuts.NEW_FILE,
      action: () => {
        setFileManagerMode("create");
        setIsFileManagerOpen(true);
      },
    },
    {
      ...commonShortcuts.AI_ASSISTANT,
      action: () => {
        setIsAIOpen(true);
      },
    },
    {
      key: "F1",
      action: () => {
        setIsShortcutsHelpOpen(true);
      },
      description: "Show keyboard shortcuts help",
    },
    {
      ...commonShortcuts.SETTINGS,
      action: () => {
        setIsSettingsOpen(true);
      },
    },
  ]);

  if (!userName || !isClient) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <title>Unified Dev Platform</title>
      </Head>
      <h1>Unified Dev Platform (Web)</h1>
      <p>Logged in as: {userName ? String(userName) : "Unknown"}</p>
      <Stack direction="row" gap="small" wrap>
        <Button onClick={handleSignOut}>Sign out</Button>
        <Button variant="outline" onClick={() => setIsAIOpen(true)}>
          🤖 AI Assistant
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFileManagerMode("open");
            setIsFileManagerOpen(true);
          }}
        >
          📁 Open File
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFileManagerMode("save");
            setIsFileManagerOpen(true);
          }}
        >
          💾 Save As
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFileManagerMode("create");
            setIsFileManagerOpen(true);
          }}
        >
          ➕ New File
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setIsShortcutsHelpOpen(true)}
        >
          ❓ Help (F1)
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setIsSettingsOpen(true)}
        >
          ⚙️ Settings
        </Button>
      </Stack>

      <Card title="Document Navigation" style={{ margin: "20px 0" }}>
        <Stack direction="row" gap="medium" align="center" wrap>
          <Stack direction="row" gap="small" align="center">
            <label>Room:</label>
            <Input
              value={roomInput}
              onChange={setRoomInput}
              placeholder="Enter room name"
            />
          </Stack>
          <Stack direction="row" gap="small" align="center">
            <label>Document:</label>
            <Input
              value={docInput}
              onChange={setDocInput}
              placeholder="Enter document name"
            />
          </Stack>
          <Button
            onClick={() => {
              const newUrl = `/?room=${encodeURIComponent(roomInput)}&doc=${encodeURIComponent(docInput)}`;
              router.push(newUrl);
            }}
          >
            Switch Document
          </Button>
        </Stack>
        <p style={{ fontSize: "14px", color: "#666", margin: "12px 0 0 0" }}>
          Current: <strong>{room}</strong> / <strong>{docName}</strong>
        </p>
      </Card>

      <h2>
        Collaborative editor powered by Yjs. Room: {room}, Document: {docName}
      </h2>
      {isClient && (
        <Stack gap="small">
          <div
            style={{
              border: "1px solid #e1e5e9",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <style jsx global>{`
              .monaco-editor .selected-text {
                background-color: rgba(0, 112, 243, 0.1) !important;
              }
              .monaco-editor .selectionHighlight {
                background-color: rgba(0, 112, 243, 0.15) !important;
              }
              .monaco-editor .wordHighlight {
                background-color: rgba(0, 112, 243, 0.1) !important;
              }
              .monaco-editor .wordHighlightStrong {
                background-color: rgba(0, 112, 243, 0.2) !important;
              }
              .monaco-editor .hover-contents {
                background-color: #ffffff !important;
                border: 1px solid #e1e5e9 !important;
                border-radius: 6px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
              }
              .monaco-editor .monaco-hover {
                background-color: #ffffff !important;
                border: 1px solid #e1e5e9 !important;
                border-radius: 6px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
              }
            `}</style>
            <MonacoEditor
              height="40vh"
              language="markdown"
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
              }}
            />
          </div>
          <Card padding="small">
            <Stack direction="row" gap="medium" align="center" wrap>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#4caf50" }}>✅</span>
                <span style={{ fontSize: "12px" }}>AI Assistant</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#2196f3" }}>💡</span>
                <span style={{ fontSize: "12px" }}>Code Completion</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#ff9800" }}>🔍</span>
                <span style={{ fontSize: "12px" }}>Hover Help</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#9c27b0" }}>⚡</span>
                <span style={{ fontSize: "12px" }}>Quick Actions</span>
              </div>
              <div
                style={{ fontSize: "11px", color: "#666", marginLeft: "auto" }}
              >
                💡 Type to trigger suggestions • Select code for AI assistance
              </div>
            </Stack>
          </Card>
        </Stack>
      )}

      <h3>Active users:</h3>
      <ul>
        {Array.isArray(users) && users.length > 0 ? (
          users
            .map((u, index) => {
              // Ensure all properties exist and are valid
              if (!u || typeof u !== "object") return null;
              const id = u.id ? String(u.id) : `user-${index}`;
              const name = u.name ? String(u.name) : "Unknown User";
              const color = u.color ? String(u.color) : "#000000";
              const cursorInfo = u.cursor
                ? ` (Line ${u.cursor.line}, Col ${u.cursor.column})`
                : "";

              return (
                <li key={`${id}-${index}`} style={{ color: color }}>
                  {name}
                  {cursorInfo}
                </li>
              );
            })
            .filter(Boolean)
        ) : (
          <li>No active users</li>
        )}
      </ul>

      <h2>Mobile Handoff</h2>
      <p>Scan with your mobile device to join this collaboration session:</p>
      {isClient && deeplink ? (
        <Stack gap="medium" align="center">
          <Card padding="medium" style={{ textAlign: "center" }}>
            <Stack gap="small" align="center">
              <QRCode value={webUrl} size={180} />
              <div style={{ fontSize: "12px", color: "#666" }}>
                📱 Scan to open in mobile browser
              </div>
            </Stack>
          </Card>

          <Stack direction="row" gap="small" wrap>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigator.clipboard.writeText(webUrl)}
            >
              📋 Copy Web Link
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigator.clipboard.writeText(deeplink)}
            >
              📱 Copy App Link
            </Button>
          </Stack>

          <Card
            title="Connection Details"
            padding="medium"
            style={{ maxWidth: "400px" }}
          >
            <Stack gap="small">
              <div>
                <strong>Room:</strong> {room}
              </div>
              <div>
                <strong>Document:</strong> {docName}
              </div>
              <div
                style={{ fontSize: "10px", color: "#666", marginTop: "8px" }}
              >
                💡 Mobile app link will work when the UDP mobile app is
                installed
              </div>
            </Stack>
          </Card>
        </Stack>
      ) : (
        <Loading text="Loading QR code and deep link..." />
      )}

      <Stack
        direction="row"
        gap="small"
        align="center"
        style={{ marginTop: "16px" }}
      >
        <label>File path:</label>
        <Input
          value={file}
          onChange={setFile}
          placeholder="/README.md"
          style={{ minWidth: "200px" }}
        />
      </Stack>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentFile={file}
        selectedCode={selectedCode}
        aiManager={aiManager}
        onCodeInsert={(code: string) => {
          // Insert code at cursor position in editor
          if (editorRef.current && typeof window !== "undefined") {
            const editor = editorRef.current;
            const position = editor.getPosition();
            if (position) {
              // Import monaco dynamically to access the Range class
              import("monaco-editor").then((monaco) => {
                editor.executeEdits("ai-assistant", [
                  {
                    range: new monaco.Range(
                      position.lineNumber,
                      position.column,
                      position.lineNumber,
                      position.column
                    ),
                    text: code,
                  },
                ]);
                editor.focus();
              });
            }
          }
        }}
      />

      {/* File Manager Modal */}
      <FileManager
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        mode={fileManagerMode}
        currentFile={file}
        onFileSelect={handleFileSelect}
        onFileSave={handleFileSave}
        onFileCreate={handleFileCreate}
      />

      {/* Shortcuts Help Modal */}
      <ShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Collaboration Panel */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          maxWidth: "300px",
        }}
      >
        <CollaborationPanel users={users} currentUserId={userId} />
      </div>
    </div>
  );
}
