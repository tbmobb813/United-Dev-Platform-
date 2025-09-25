import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CollaborativeEditor } from '../../components/CollaborativeEditor';

export default function CollaborateScreen() {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('default-room');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // For now, generate user data (in a real app, you'd use AsyncStorage)
      const storedUserId = `mobile-user-${Date.now()}`;
      const storedUserName = `Mobile User ${storedUserId.slice(-4)}`;

      setUserId(storedUserId);
      setUserName(storedUserName);
      setIsReady(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      console.error('Error loading user data:', error);
    }
  };

  const handleContentChange = (content: string) => {
    // Handle content changes (e.g., save to local storage)
    console.log('Content updated:', content.length, 'characters');
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CollaborativeEditor
        roomId={roomId}
        documentId="main-document"
        userId={userId}
        userName={userName}
        onContentChange={handleContentChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
