'use client';

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import logger from '@udp/logger';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as Y from '@udp/editor-core/yjs-singleton';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';
import { v4 as uuidv4 } from 'uuid';
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
  useTheme,
  useRegisterCommands,
  SidebarLayout,
  SidebarSection,
} from '@udp/ui';
import { AIAssistant, AIManager } from '@udp/ai';
import { codeCompletionService } from '../components/CodeCompletionProvider';
import { useAppCommands } from '../hooks/useAppCommands';

// Dynamic imports for client-side only components
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <Loading text='Loading editor...' />,
});

const QRCode = dynamic(
  () => import('qrcode.react').then(mod => (mod as any).default || mod),
  {
    ssr: false,
    loading: () => <Loading text='Loading QR code...' />,
  }
);
const QRCodeAny: any = QRCode;

function generateColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleMode } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [collaborativeSessionId, setCollaborativeSessionId] = useState<string | null>(null);
  const [projectId] = useState('demo-project-id'); // TODO: Get from project selector
  const room = (router.query.room as string) || 'default-room';
  const docName = (router.query.doc as string) || 'main-document';
  const [file, setFile] = useState('/README.md');
  const [roomInput, setRoomInput] = useState(room);
  const [docInput, setDocInput] = useState(docName);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();
  const [aiInitialIntent, setAiInitialIntent] = useState<
    'chat' | 'explain' | 'generate' | 'debug' | 'optimize' | 'test'
  >('chat');
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [fileManagerMode, setFileManagerMode] = useState<
    'open' | 'save' | 'create'
  >('open');
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  // Register app commands for command palette
  const appCommands = useAppCommands({
    onOpenFile: () => {
      setFileManagerMode('open');
      setIsFileManagerOpen(true);
    },
    onSaveFile: () => {
      setFileManagerMode('save');
      setIsFileManagerOpen(true);
    },
    onCreateFile: () => {
      setFileManagerMode('create');
      setIsFileManagerOpen(true);
    },
    onOpenAI: (initialPrompt, initialIntent) => {
      setAiInitialPrompt(initialPrompt);
      setAiInitialIntent(initialIntent || 'chat');
      setIsAIOpen(true);
    },
    onOpenSettings: () => setIsSettingsOpen(true),
    onOpenShortcuts: () => setIsShortcutsHelpOpen(true),
    onToggleTheme: toggleMode,
    onSignOut: handleSignOut,
    selectedCode,
  });
  useRegisterCommands(appCommands);

  // Sidebar navigation sections
  const sidebarSections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: '🏠',
          active: router.pathname === '/',
          onClick: () => router.push('/'),
        },
        {
          id: 'files',
          label: 'Files',
          icon: '📁',
          onClick: () => {
            setFileManagerMode('open');
            setIsFileManagerOpen(true);
          },
        },
        {
          id: 'ai',
          label: 'AI Assistant',
          icon: '🤖',
          onClick: () => setIsAIOpen(true),
          badge: selectedCode ? '1' : undefined,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          id: 'minimal',
          label: 'Minimal Editor',
          icon: '📝',
          active: router.pathname === '/minimal',
          onClick: () => router.push('/minimal'),
        },
        {
          id: 'offline',
          label: 'Offline Demo',
          icon: '📴',
          active: router.pathname === '/offline-demo',
          onClick: () => router.push('/offline-demo'),
        },
        {
          id: 'presence',
          label: 'Presence Demo',
          icon: '👥',
          active: router.pathname === '/presence-demo',
          onClick: () => router.push('/presence-demo'),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'theme',
          label: 'Toggle Theme',
          icon: '🌓',
          onClick: toggleMode,
        },
        {
          id: 'shortcuts',
          label: 'Shortcuts',
          icon: '⌨️',
          onClick: () => setIsShortcutsHelpOpen(true),
          shortcut: 'F1',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: '⚙️',
          onClick: () => setIsSettingsOpen(true),
        },
      ],
    },
  ];

  // AI Manager for real AI integration
  const [aiManager, setAiManager] = useState<AIManager | null>(null);

  // Initialize AI Manager when component mounts
  useEffect(() => {
    // For now, create AI manager without API keys (will use fallback responses)
    // In a real app, these would come from user settings/environment variables
    try {
      const manager = new AIManager({
        defaultProvider: 'openai',
        apiKeys: {
          // No API keys provided - will trigger fallback responses
        },
        enableStreaming: true,
      });
      setAiManager(manager);
    } catch (error) {
      logger.warn('AI Manager initialization failed:', error);
      // Component will work without AI manager (shows fallback responses)
    }
  }, []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Generate both mobile app deeplink and fallback web URL
  const webUrl = `${
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'
  }?room=${encodeURIComponent(room)}&doc=${encodeURIComponent(docName)}`;
  const deeplink = `udp://open?repo=demo&file=${encodeURIComponent(
    file
  )}&cursor=1,1&room=${encodeURIComponent(room)}&doc=${encodeURIComponent(
    docName
  )}&fallback=${encodeURIComponent(webUrl)}`;

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const ignoreRef = useRef<boolean>(false);
  const editorRef = useRef<
    import('monaco-editor').editor.IStandaloneCodeEditor | null
  >(null);
  type MonacoBindingType = { destroy: () => void };
  const bindingRef = useRef<MonacoBindingType | null>(null);
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
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user || status !== 'authenticated') {
      return;
    }

    const userId = (session.user as any).id;
    if (!userId) {
      logger.error('User ID not found in session');
      return;
    }

    // Create or join collaborative session
    const createSession = async () => {
      try {
        // For now, use room as session identifier
        // In production, you'd create/fetch a proper session from the API
        const sessionId = `session-${room}-${docName}`;
        setCollaborativeSessionId(sessionId);

        const docId = `${room}-${docName}`;
        const doc = new Y.Doc();

        // Build WebSocket URL with authentication parameters
        const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3030';
        const wsUrl = `${wsBaseUrl}?sessionId=${encodeURIComponent(sessionId)}&projectId=${encodeURIComponent(projectId)}&userId=${encodeURIComponent(userId)}`;

        const provider = new WebsocketProvider(
          wsUrl,
          docId,
          doc,
          { connect: true }
        );

        // Add error handling for WebSocket
        provider.on('status', (event: { status: string }) => {
          logger.info('WebSocket status:', event.status);

          // Send join-session message when connected
          if (event.status === 'connected' && provider.ws) {
            const joinMessage = JSON.stringify({
              type: 'join-session',
              sessionId,
              projectId,
              userId,
              userName: session.user?.name || 'Unknown User',
            });
            provider.ws.send(joinMessage);
            logger.info('Sent join-session message');
          }
        });

        provider.on('connection-error', (error: Error) => {
          logger.error('WebSocket connection error:', error);
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
        if (!awarenessRef.current) {
          return;
        }
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
            .map(user => ({
              id: String(user.id),
              name: String(user.name),
              color: String(user.color),
              cursor: user.cursor,
            }));
          setUsers(userList);

          // Update cursor decorations in editor (narrow to users with cursor)
          const usersWithCursors = userList.filter(
            (
              u
            ): u is {
              id: string;
              name: string;
              color: string;
              cursor: { line: number; column: number };
            } => Boolean(u.cursor)
          );

          if (editorRef.current) {
            updateCursorDecorations(usersWithCursors);
          }
        } catch (error) {
          logger.error('Error updating user list:', error);
          setUsers([]);
        }
      };

        awareness.setLocalStateField('user', {
          id: userId,
          name: session.user?.name || 'Unknown User',
          color: generateColor(),
        });

        awareness.on('change', handleChange);
        handleChange();

        ydocRef.current = doc;
        providerRef.current = provider;
        ytextRef.current = ytext;
        awarenessRef.current = awareness;
      } catch (error) {
        logger.error('Error setting up Yjs:', error);
      }
    };

    createSession();

    return () => {
      if (awarenessRef.current) {
        awarenessRef.current.off('change', handleChange);
      }
      if (providerRef.current) {
        // Send leave-session message before disconnecting
        if (providerRef.current.ws && collaborativeSessionId) {
          const leaveMessage = JSON.stringify({
            type: 'leave-session',
            sessionId: collaborativeSessionId,
            userId,
          });
          try {
            providerRef.current.ws.send(leaveMessage);
          } catch (error) {
            logger.warn('Failed to send leave-session message:', error);
          }
        }
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [room, docName, session, status, projectId, collaborativeSessionId]);

  const updateCursorDecorations = (
    usersWithCursors: {
      id: string;
      name: string;
      color: string;
      cursor: { line: number; column: number };
    }[]
  ) => {
    if (!editorRef.current || typeof window === 'undefined') {
      return;
    }

    try {
      const decorations = usersWithCursors.map(user => ({
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
      const styleId = 'user-cursor-styles';
      let styleElement = document.getElementById(
        styleId
      ) as HTMLStyleElement | null;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const styles = usersWithCursors
        .map(
          user => `
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
        .join('\n');

      styleElement.textContent = styles;
    } catch (error) {
      logger.warn('Failed to update cursor decorations:', error);
    }
  };

  const handleEditorDidMount = async (
    editor: import('monaco-editor').editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (!model || !ytextRef.current) {
      return;
    }

    // Configure editor options
    editor.updateOptions({
      wordWrap: 'on',
      minimap: { enabled: false },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      suggestSelection: 'first',
      acceptSuggestionOnEnter: 'on',
      hover: {
        enabled: true,
        delay: 300,
      },
      selectionHighlight: true,
      occurrencesHighlight: 'singleFile',
      renderLineHighlight: 'gutter',
      smoothScrolling: true,
      cursorSmoothCaretAnimation: 'on',
    });

    model.setValue(ytextRef.current.toString());

    // Initialize code completion providers
    try {
      await codeCompletionService.registerCompletionProviders();
      await codeCompletionService.registerHoverProvider();
      logger.info('✅ Code completion initialized');
    } catch (error) {
      logger.warn('Failed to initialize code completion:', error);
    }

    const yObserver = () => {
      if (!ytextRef.current || ignoreRef.current) {
        return;
      }
      ignoreRef.current = true;
      model.setValue(ytextRef.current.toString());
      ignoreRef.current = false;
    };
    ytextRef.current.observe(yObserver);

    const disposable = editor.onDidChangeModelContent(() => {
      if (!ytextRef.current || ignoreRef.current) {
        return;
      }
      ignoreRef.current = true;
      const val = model.getValue();
      ytextRef.current.doc?.transact(() => {
        ytextRef.current!.delete(0, ytextRef.current!.length);
        ytextRef.current!.insert(0, val);
      });
      ignoreRef.current = false;
    });

    // Track cursor position changes
    const cursorDisposable = editor.onDidChangeCursorPosition(e => {
      if (!awarenessRef.current || ignoreRef.current) {
        return;
      }

      const position = e.position;
      const cursorData = {
        line: position.lineNumber,
        column: position.column,
      };

      awarenessRef.current.setLocalStateField('user', {
        ...awarenessRef.current.getLocalState()?.user,
        cursor: cursorData,
      });

      // Send cursor update to server
      if (providerRef.current?.ws && collaborativeSessionId) {
        try {
          const cursorMessage = JSON.stringify({
            type: 'cursor-update',
            sessionId: collaborativeSessionId,
            userId: (session as any)?.user?.id,
            cursor: cursorData,
          });
          providerRef.current.ws.send(cursorMessage);
        } catch (error) {
          // Ignore errors - cursor updates are not critical
        }
      }
    });

    // Track text selection for AI assistant
    const selectionDisposable = editor.onDidChangeCursorSelection(e => {
      if (!e.selection.isEmpty()) {
        const selectedText = model.getValueInRange(e.selection);
        if (selectedText) {
          setSelectedCode(selectedText);
        }
      } else {
        setSelectedCode('');
      }
    });

    editor.onDidDispose(() => {
      if (ytextRef.current) {
        ytextRef.current.unobserve(yObserver);
      }
      disposable.dispose();
      cursorDisposable.dispose();
      selectionDisposable.dispose();
    });
  };

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/auth/signin' });
  };

  // FileManager handlers
  const handleFileSelect = (selectedFile: string) => {
    setFile(selectedFile);
    setIsFileManagerOpen(false);
  };

  const handleFileSave = (filePath: string, content: string) => {
    // Save file content to localStorage as a placeholder for actual save logic
    localStorage.setItem(`file:${filePath}`, content);
    // Implement save logic here
    setFile(filePath);
    setIsFileManagerOpen(false);
  };

  const handleFileCreate = (filePath: string) => {
    // Implement create logic here
    setFile(filePath);
    setIsFileManagerOpen(false);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...commonShortcuts.SAVE,
      action: () => {
        logger.info('Save shortcut triggered');
        // Implement save logic here
      },
    },
    {
      ...commonShortcuts.OPEN,
      action: () => {
        setFileManagerMode('open');
        setIsFileManagerOpen(true);
      },
    },
    {
      ...commonShortcuts.NEW_FILE,
      action: () => {
        setFileManagerMode('create');
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
      key: 'F1',
      action: () => {
        setIsShortcutsHelpOpen(true);
      },
      description: 'Show keyboard shortcuts help',
    },
    {
      ...commonShortcuts.SETTINGS,
      action: () => {
        setIsSettingsOpen(true);
      },
    },
  ]);

  if (status === 'loading' || !isClient) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Redirecting to sign in...</div>;
  }

  return (
    <SidebarLayout
      sidebar={{
        sections: sidebarSections,
        header: <div style={{ fontWeight: 600, fontSize: '18px' }}>UDP</div>,
        footer: (
          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              {session?.user?.name || session?.user?.email || 'Unknown'}
            </div>
            <Button
              size='small'
              variant='ghost'
              onClick={handleSignOut}
              fullWidth
            >
              Sign out
            </Button>
          </div>
        ),
      }}
    >
      <div style={{ padding: '24px' }}>
        <Head>
          <title>Unified Dev Platform</title>
        </Head>
        <h1>Unified Dev Platform (Web)</h1>

        <Card title='Document Navigation' style={{ margin: '20px 0' }}>
          <Stack direction='row' gap='medium' align='center' wrap>
            <Stack direction='row' gap='small' align='center'>
              <label>Room:</label>
              <Input
                value={roomInput}
                onChange={setRoomInput}
                placeholder='Enter room name'
              />
            </Stack>
            <Stack direction='row' gap='small' align='center'>
              <label>Document:</label>
              <Input
                value={docInput}
                onChange={setDocInput}
                placeholder='Enter document name'
              />
            </Stack>
            <Button
              onClick={() => {
                const newUrl = `/?room=${encodeURIComponent(
                  roomInput
                )}&doc=${encodeURIComponent(docInput)}`;
                router.push(newUrl);
              }}
            >
              Switch Document
            </Button>
          </Stack>
          <p style={{ fontSize: '14px', color: '#666', margin: '12px 0 0 0' }}>
            Current: <strong>{room}</strong> / <strong>{docName}</strong>
          </p>
        </Card>

        <h2>
          Collaborative editor powered by Yjs. Room: {room}, Document: {docName}
        </h2>
        {isClient && (
          <Stack gap='small'>
            <div
              style={{
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                overflow: 'hidden',
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
                height='40vh'
                language='markdown'
                onMount={handleEditorDidMount}
                theme='vs-light'
                options={{
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: 'line',
                  automaticLayout: true,
                }}
              />
            </div>
            <Card padding='small'>
              <Stack direction='row' gap='medium' align='center' wrap>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span style={{ color: '#4caf50' }}>✅</span>
                  <span style={{ fontSize: '12px' }}>AI Assistant</span>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span style={{ color: '#2196f3' }}>💡</span>
                  <span style={{ fontSize: '12px' }}>Code Completion</span>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span style={{ color: '#ff9800' }}>🔍</span>
                  <span style={{ fontSize: '12px' }}>Hover Help</span>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span style={{ color: '#9c27b0' }}>⚡</span>
                  <span style={{ fontSize: '12px' }}>Quick Actions</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    marginLeft: 'auto',
                  }}
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
                if (!u || typeof u !== 'object') {
                  return null;
                }
                const id = u.id ? String(u.id) : `user-${index}`;
                const name = u.name ? String(u.name) : 'Unknown User';
                const color = u.color ? String(u.color) : '#000000';
                const cursorInfo = u.cursor
                  ? ` (Line ${u.cursor.line}, Col ${u.cursor.column})`
                  : '';

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
          <Stack gap='medium' align='center'>
            <Card padding='medium' style={{ textAlign: 'center' }}>
              <Stack gap='small' align='center'>
                <QRCodeAny value={webUrl} size={180} />
                <div style={{ fontSize: '12px', color: '#666' }}>
                  📱 Scan to open in mobile browser
                </div>
              </Stack>
            </Card>

            <Stack direction='row' gap='small' wrap>
              <Button
                variant='outline'
                size='small'
                onClick={() => navigator.clipboard.writeText(webUrl)}
              >
                📋 Copy Web Link
              </Button>
              <Button
                variant='outline'
                size='small'
                onClick={() => navigator.clipboard.writeText(deeplink)}
              >
                📱 Copy App Link
              </Button>
            </Stack>

            <Card
              title='Connection Details'
              padding='medium'
              style={{ maxWidth: '400px' }}
            >
              <Stack gap='small'>
                <div>
                  <strong>Room:</strong> {room}
                </div>
                <div>
                  <strong>Document:</strong> {docName}
                </div>
                <div
                  style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}
                >
                  💡 Mobile app link will work when the UDP mobile app is
                  installed
                </div>
              </Stack>
            </Card>
          </Stack>
        ) : (
          <Loading text='Loading QR code and deep link...' />
        )}

        <Stack
          direction='row'
          gap='small'
          align='center'
          style={{ marginTop: '16px' }}
        >
          <label>File path:</label>
          <Input
            value={file}
            onChange={setFile}
            placeholder='/README.md'
            style={{ minWidth: '200px' }}
          />
        </Stack>

        {/* AI Assistant Modal */}
        <AIAssistant
          isOpen={isAIOpen}
          onClose={() => {
            setIsAIOpen(false);
            setAiInitialPrompt(undefined);
            setAiInitialIntent('chat');
          }}
          currentFile={file}
          selectedCode={selectedCode}
          aiManager={aiManager ?? undefined}
          initialPrompt={aiInitialPrompt}
          initialIntent={aiInitialIntent}
          onCodeInsert={(code: string) => {
            // Insert code at cursor position in editor
            if (editorRef.current && typeof window !== 'undefined') {
              const editor = editorRef.current;
              const position = editor.getPosition();
              if (position) {
                // Import monaco dynamically to access the Range class
                import('monaco-editor').then(monaco => {
                  editor.executeEdits('ai-assistant', [
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
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '300px',
          }}
        >
          <CollaborationPanel users={users} currentUserId={userId} />
        </div>
      </div>
    </SidebarLayout>
  );
}
