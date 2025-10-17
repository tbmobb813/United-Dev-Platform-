import { Card, Stack } from '@udp/ui-native';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { CollaborativeEditor } from './components/CollaborativeEditor';
import { MobileHome } from './components/MobileHome';

export default function App() {
  const [params, setParams] = useState({
    repo: '',
    file: '',
    cursor: '',
    room: 'default-room',
    doc: 'main-document',
  });
  const [useDeepLink, setUseDeepLink] = useState(false);

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { queryParams } = Linking.parse(url);
      const newParams = {
        repo: queryParams.repo || '',
        file: queryParams.file || '',
        cursor: queryParams.cursor || '',
        room: queryParams.room || 'default-room',
        doc: queryParams.doc || 'main-document',
      };
      setParams(newParams);

      // If we have repo/file params, show the collaborative editor
      if (newParams.repo && newParams.file) {
        setUseDeepLink(true);
      }
    };

    const sub = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => sub.remove();
  }, []);

  const handleContentChange = _newContent => {
    // Content change is handled by the CollaborativeEditor
  };

  const generateUserId = () => {
    return `mobile-user-${Math.random().toString(36).substr(2, 9)}`;
  };

  // If we have deep link params, show the collaborative editor
  if (useDeepLink && params.repo && params.file) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 24 }}>
        <Stack gap='medium'>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            UDP Mobile - Collaborative Mode
          </Text>

          <Card title='Connection Info' padding='medium'>
            <Stack gap='small'>
              <Text>Repo: {params.repo}</Text>
              <Text>File: {params.file}</Text>
              <Text>Room: {params.room}</Text>
              <Text>Document: {params.doc}</Text>
            </Stack>
          </Card>

          <Text style={{ fontSize: 12, color: '#666' }}>
            Real-time collaborative editing with web app
          </Text>

          <Card title={`Document: ${params.doc}`} padding='medium'>
            <CollaborativeEditor
              roomId={params.room}
              documentId={params.doc}
              userId={generateUserId()}
              userName='Mobile User'
              onContentChange={handleContentChange}
            />
          </Card>

          <Text style={{ fontSize: 12, color: '#999' }}>
            Changes sync in real-time with web editor
          </Text>
        </Stack>
      </SafeAreaView>
    );
  }

  // Default: Show the new mobile home with file browser
  return <MobileHome />;
}
