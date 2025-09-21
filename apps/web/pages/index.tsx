import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@udp/ui";

// Dynamic imports for client-side only components
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const QRCode = dynamic(() => import("qrcode.react"), {
  ssr: false,
  loading: () => <div>Loading QR code...</div>,
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
  const deeplink = `udp://open?repo=demo&file=${encodeURIComponent(
    file
  )}&cursor=1,1&room=${encodeURIComponent(room)}&doc=${encodeURIComponent(docName)}`;

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

      const userId = uuidv4().substring(0, 5);

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
  }, [room, docName, userName]);

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

  const handleEditorDidMount = (
    editor: import("monaco-editor").editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (!model || !ytextRef.current) return;
    editor.updateOptions({ wordWrap: "on", minimap: { enabled: false } });
    model.setValue(ytextRef.current.toString());

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

    editor.onDidDispose(() => {
      if (ytextRef.current) ytextRef.current.unobserve(yObserver);
      disposable.dispose();
      cursorDisposable.dispose();
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  if (!userName || !isClient) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <title>Unified Dev Platform</title>
      </Head>
      <h1>Unified Dev Platform (Web)</h1>
      <p>Logged in as: {userName ? String(userName) : "Unknown"}</p>
      <Button onClick={handleSignOut}>Sign out</Button>

      <div
        style={{
          margin: "20px 0",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Document Navigation</h3>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label>Room:</label>
          <input
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room name"
            style={{
              padding: "6px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <label>Document:</label>
          <input
            value={docInput}
            onChange={(e) => setDocInput(e.target.value)}
            placeholder="Enter document name"
            style={{
              padding: "6px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Button
            onClick={() => {
              const newUrl = `/?room=${encodeURIComponent(roomInput)}&doc=${encodeURIComponent(docInput)}`;
              router.push(newUrl);
            }}
          >
            Switch Document
          </Button>
        </div>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Current: <strong>{room}</strong> / <strong>{docName}</strong>
        </p>
      </div>

      <h2>
        Collaborative editor powered by Yjs. Room: {room}, Document: {docName}
      </h2>
      {isClient && (
        <MonacoEditor
          height="40vh"
          language="markdown"
          onMount={handleEditorDidMount}
        />
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

      <h2>Mobile Handoff (QR demo)</h2>
      <p>Scan to open the same document on the mobile client via deep link:</p>
      {isClient && deeplink ? (
        <div>
          <QRCode value={String(deeplink)} size={180} />
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontFamily: "monospace",
              fontSize: "12px",
              wordBreak: "break-all",
              marginTop: "10px",
            }}
          >
            <strong>Deep Link:</strong>
            <br />
            {String(deeplink)}
          </div>
        </div>
      ) : (
        <div>Loading QR code and deep link...</div>
      )}

      <p>
        File path:
        <input
          value={file}
          onChange={(e) => setFile(e.target.value)}
          style={{
            padding: 6,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginLeft: 8,
          }}
        />
      </p>
    </div>
  );
}
