import * as Linking from 'expo-linking';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, TextInput } from 'react-native';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export default function App() {
  const [params, setParams] = useState({ repo: '', file: '', cursor: '', room: 'room-demo' });
  const [content, setContent] = useState('');
  const ydocRef = useRef();
  const ytextRef = useRef();

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { queryParams } = Linking.parse(url);
      setParams({
        repo: queryParams.repo || '',
        file: queryParams.file || '',
        cursor: queryParams.cursor || '',
        room: queryParams.room || 'room-demo',
      });
    };
    const sub = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:3030', params.room, doc);
    const ytext = doc.getText('main');
    if (ytext.length === 0) ytext.insert(0, '');
    ytext.observe(() => {
      setContent(ytext.toString());
    });
    ydocRef.current = doc;
    ytextRef.current = ytext;
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [params.room]);

  const handleChange = (value) => {
    setContent(value);
    const ytext = ytextRef.current;
    if (ytext) {
      ytext.doc?.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, value);
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>UDP Mobile</Text>
      <Text>Repo: {params.repo}</Text>
      <Text>File: {params.file}</Text>
      <Text>Room: {params.room}</Text>
      <TextInput
        style={{ marginTop: 12, height: 200, borderColor: '#ccc', borderWidth: 1, padding: 8 }}
        multiline
        value={content}
        onChangeText={handleChange}
      />
    </SafeAreaView>
  );
}