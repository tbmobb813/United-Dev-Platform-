import { DocumentManager, UserPresence } from '@udp/editor-core';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import * as Y from 'yjs';
import { config } from '../config';

interface CollaborativeEditorProps {
  roomId: string;
  documentId?: string;
  userId: string;
  userName: string;
  onContentChange?: (content: string) => void;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  roomId,
  documentId = 'main-document',
  userId,
  userName,
  onContentChange,
}) => {
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentManager = useRef<DocumentManager | null>(null);
  const yText = useRef<Y.Text | null>(null);

  useEffect(() => {
    initializeCollaboration();
    return () => {
      documentManager.current?.destroy();
    };
  }, [roomId, documentId, userId, userName]);

  const initializeCollaboration = async () => {
    try {
      setError(null);

      // Generate a random color for the user
      const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

      const user: Omit<UserPresence, 'lastSeen' | 'isActive'> = {
        id: userId,
        name: userName,
        color: userColor,
      };

      documentManager.current = new DocumentManager(
        user,
        config.wsUrl
      );

      const doc = await documentManager.current.openDocument(
        roomId,
        documentId
      );
      yText.current = doc.content;

      // Set initial content
      setContent(yText.current ? yText.current.toString() : '');
      setIsConnected(true);

      // Listen for remote changes
      if (yText.current) {
        yText.current.observe(() => {
          const newContent = yText.current!.toString();
          setContent(newContent);
          onContentChange?.(newContent);
        });
      }

      // Listen for collaborator changes
      documentManager.current.onCollaboratorsChanged(setCollaborators);
    } catch (err) {
      setError(
        `Failed to connect: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      setIsConnected(false);
    }
  };

  const handleTextChange = (text: string) => {
    if (!yText.current) {
      return;
    }

    try {
      // Replace the entire content (simple approach for mobile)
      yText.current.delete(0, yText.current.length);
      yText.current.insert(0, text);
      setContent(text);
      onContentChange?.(text);
    } catch {
      // Error updating text; optionally handle error here
    }
  };

  const getConnectionStatus = () => {
    if (error) {
      return `Error: ${error}`;
    }
    if (!isConnected) {
      return 'Connecting...';
    }
    return `Connected • ${collaborators.length} collaborator${collaborators.length !== 1 ? 's' : ''}`;
  };

  return (
    <View style={styles.container}>
      {/* Header with connection status */}
      <View style={styles.header}>
        <Text style={styles.title}>Collaborative Editor</Text>
        <Text
          style={[
            styles.status,
            { color: isConnected ? '#22c55e' : error ? '#ef4444' : '#f59e0b' },
          ]}
        >
          {getConnectionStatus()}
        </Text>
      </View>

      {/* Collaborators list */}
      {collaborators.length > 0 && (
        <View style={styles.collaborators}>
          <Text style={styles.collaboratorsTitle}>Active Collaborators:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {collaborators.map(user => (
              <View key={user.id} style={styles.collaboratorChip}>
                <View
                  style={[
                    styles.collaboratorColor,
                    { backgroundColor: user.color },
                  ]}
                />
                <Text style={styles.collaboratorName}>{user.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Editor */}
      <View style={styles.editorContainer}>
        <TextInput
          style={styles.editor}
          value={content}
          onChangeText={handleTextChange}
          placeholder='Type here and collaborate in real-time...'
          placeholderTextColor='#9ca3af'
          multiline
          textAlignVertical='top'
          editable={isConnected}
        />
      </View>

      {/* Footer info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Room: {roomId} • Document: {documentId}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  collaborators: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  collaboratorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  collaboratorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  collaboratorColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  collaboratorName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    fontFamily: 'monospace',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
