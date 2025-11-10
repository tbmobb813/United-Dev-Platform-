'use client';

import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import logger from '@udp/logger';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as Y from '@udp/editor-core/yjs-singleton';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';
import { v4 as uuidv4 } from 'uuid';
// Using native button here to avoid type issues during rebase resolution.

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
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [collaborativeSessionId, setCollaborativeSessionId] = useState<string | null>(null);
  const [projectId] = useState('demo-project-id'); // TODO: Get from project selector
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
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user || status !== 'authenticated' || !isClient) {
      return;
    }

    const userId = (session.user as any).id;
    if (!userId) {
      logger.error('User ID not found in session');
      return;
    }

    const createSession = async () => {
      try {
        const sessionId = `session-${room}`;
        setCollaborativeSessionId(sessionId);

        const doc = new Y.Doc();

        // Build WebSocket URL with authentication parameters
        const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3030';
        const wsUrl = `${wsBaseUrl}?sessionId=${encodeURIComponent(sessionId)}&projectId=${encodeURIComponent(projectId)}&userId=${encodeURIComponent(userId)}`;

        const provider = new WebsocketProvider(
          wsUrl,
          room,
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
          }
        });

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
          logger.error('Error updating user list:', error);
          setUsers([]);
        }
      };

        const userId = (session.user as any).id;
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
          const userId = (session.user as any).id;
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
  }, [room, session, status, isClient, projectId, collaborativeSessionId]);

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (status === 'loading' || !isClient) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Redirecting to sign in...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        <title>Minimal Unified Dev Platform</title>
      </Head>
      <h1>Minimal Unified Dev Platform (Web)</h1>
      <p>Logged in as: {String(userName)}</p>
      <button onClick={handleSignOut}>Sign out</button>

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
