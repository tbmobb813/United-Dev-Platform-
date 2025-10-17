'use client';

import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@udp/ui';

function generateColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function MinimalHomeClient() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const room = (router.query.room as string) || 'room-demo';
  const [file, setFile] = useState('/README.md');

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const [users, setUsers] = useState<
    { id: string; name: string; color: string }[]
  >([]);

  useEffect(() => {
    setIsClient(true);
    const storedName =
      typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    if (!storedName) {
      router.push('/login');
    } else {
      setUserName(storedName);
    }
  }, [router]);

  useEffect(() => {
    if (!userName || !isClient) {
      return;
    }

    try {
      const doc = new Y.Doc();
      const provider = new WebsocketProvider(
        process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3030',
        room,
        doc
      );

      const ytext = doc.getText('main');
      const awareness = provider.awareness;
      if (ytext.length === 0) {
        ytext.insert(
          0,
          '# Collaborative Doc\n\nType here and open the mobile app to test handoff.'
        );
      }
      const userId = uuidv4().substring(0, 5);

      const handleChange = () => {
        if (!awarenessRef.current) {
          return;
        }
        try {
          const userStates = awarenessRef.current.getStates();
          const userList = Array.from(userStates.values())
            .map(
              (state: { user?: { id: string; name: string; color: string } }) =>
                state.user
            )
            .filter(
              (user): user is { id: string; name: string; color: string } =>
                Boolean(user && user.id && user.name && user.color)
            )
            .map(user => ({
              id: String(user.id),
              name: String(user.name),
              color: String(user.color),
            }));
          setUsers(userList);
        } catch (error) {
          console.error('Error updating user list:', error);
          setUsers([]);
        }
      };

      awareness.setLocalStateField('user', {
        id: userId,
        name: userName,
        color: generateColor(),
      });

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
    } catch (error) {
      console.error('Error setting up Yjs:', error);
    }
  }, [room, userName, isClient]);

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (!userName || !isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        <title>Minimal Unified Dev Platform</title>
      </Head>
      <h1>Minimal Unified Dev Platform (Web)</h1>
      <p>Logged in as: {String(userName)}</p>
      <Button onClick={handleSignOut}>Sign out</Button>

      <h2>Collaborative Room: {String(room)}</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          marginTop: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3>Text Content (No Monaco Editor Yet):</h3>
        <p>{ytextRef.current ? ytextRef.current.toString() : 'Loading...'}</p>
      </div>

      <h3>Active users:</h3>
      <div
        style={{ border: '1px solid #ddd', padding: '10px', marginTop: '10px' }}
      >
        {Array.isArray(users) && users.length > 0 ? (
          <ul>
            {users.map((user, index) => {
              if (!user || typeof user !== 'object') {
                return <li key={`invalid-${index}`}>Invalid user data</li>;
              }

              const safeId = user.id ? String(user.id) : `user-${index}`;
              const safeName = user.name ? String(user.name) : 'Unknown User';
              const safeColor = user.color ? String(user.color) : '#000000';

              return (
                <li key={`${safeId}-${index}`} style={{ color: safeColor }}>
                  {safeName} (ID: {safeId})
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No active users</p>
        )}
      </div>

      <h3>Deep Link:</h3>
      <p>
        File path:
        <input
          value={file}
          onChange={e => setFile(e.target.value)}
          style={{
            padding: 6,
            border: '1px solid #ddd',
            borderRadius: 6,
            marginLeft: 8,
          }}
        />
      </p>
      <p>
        Deep link: udp://open?repo=demo&file={encodeURIComponent(file)}
        &cursor=1,1&room={encodeURIComponent(room)}
      </p>

      <hr style={{ margin: '20px 0' }} />
      <p>
        <strong>
          This minimal version should work without React rendering errors.
        </strong>
      </p>
      <p>If this works, we can gradually add Monaco Editor and QR Code back.</p>
    </div>
  );
}
