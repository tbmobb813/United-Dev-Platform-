import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';
import { listUsers } from '@udp/editor-core/awareness';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@udp/ui/Button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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
  const [userName, setUserName] = useState<string | null>(null);
  const room = (router.query.room as string) || 'room-demo';
  const [file, setFile] = useState('/README.md');
  const deeplink = `udp://open?repo=demo&file=${encodeURIComponent(file)}&cursor=1,1&room=${encodeURIComponent(room)}`;

  const ydocRef = useRef<Y.Doc>();
  const providerRef = useRef<WebsocketProvider>();
  const ytextRef = useRef<Y.Text>();
  const awarenessRef = useRef<Awareness>();
  const ignoreRef = useRef(false);
  const [users, setUsers] = useState<{ id: string; name: string; color: string }[]>([]);

  useEffect(() => {
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    if (!storedName) {
      router.push('/login');
    } else {
      setUserName(storedName);
    }
  }, [router]);

  useEffect(() => {
    if (!userName) return;
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3030', room, doc);
    const ytext = doc.getText('main');
    const awareness = provider.awareness;
    if (ytext.length === 0) {
      ytext.insert(0, '# Collaborative Doc\n\nType here and open the mobile app to test handoff.');
    }
    const userId = uuidv4().substring(0, 5);
    awareness.setLocalStateField('user', {
      id: userId,
      name: userName,
      color: generateColor(),
    const handleChange = () => {
      setUsers(listUsers(awareness));
    };
    };
    awareness.on('change', handleChange);
    handleChange();

    ydocRef.current = doc;
    providerRef.current = provider;
    ytextRef.current = ytext;
    awarenessRef.current = awareness;

    return () => {
      awareness.off('change', handleChange);
      provider.destroy();
      doc.destroy();
    };
  }, [room, userName]);

  const handleEditorDidMount = (editor: any) => {
    const model = editor.getModel();
    if (!model || !ytextRef.current) return;
    editor.updateOptions({ wordWrap: 'on', minimap: { enabled: false } });
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

    editor.onDidDispose(() => {
      if (ytextRef.current) ytextRef.current.unobserve(yObserver);
      disposable.dispose();
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (!userName) return null;

  return (
    <>
      <Head>
        <title>Unified Dev Platform</title>
      </Head>
      <h1>Unified Dev Platform (Web)</h1>
      <p>Logged in as {userName}</p>
      <Button onClick={handleSignOut}>Sign out</Button>
      <h2>Collaborative editor powered by Yjs. Room: {room}</h2>
      <MonacoEditor height="40vh" language="markdown" onMount={handleEditorDidMount} />
      <h3>Active users:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id} style={{ color: u.color }}>{u.name}</li>
        ))}
      </ul>
      <h2>Mobile Handoff (QR demo)</h2>
      <p>Scan to open the same document on the mobile client via deep link:</p>
      <QRCode value={deeplink} size={180} />
      <p>
        File path:&nbsp;
        <input
          value={file}
          onChange={(e) => setFile(e.target.value)}
          style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
        />
      </p>
    </>
  );
}