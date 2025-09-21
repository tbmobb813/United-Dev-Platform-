import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';

export default function App() {
  const [params, setParams] = useState({ repo: '', file: '', cursor: '' });

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { queryParams } = Linking.parse(url);
      setParams({
        repo: queryParams.repo || '',
        file: queryParams.file || '',
        cursor: queryParams.cursor || ''
      });
    };
    const sub = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => { if (url) handleDeepLink({ url }); });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>UDP Mobile</Text>
      <Text style={{ marginTop: 8 }}>Deep link parameters:</Text>
      <View style={{ marginTop: 12 }}>
        <Text>repo: {params.repo}</Text>
        <Text>file: {params.file}</Text>
        <Text>cursor: {params.cursor}</Text>
      </View>
      <View style={{ marginTop: 24 }}>
        <Text>Editor placeholder (wire Yjs later)</Text>
        <TextInput
          placeholder="File contents..."
          multiline
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, minHeight: 180 }}
        />
      </View>
    </SafeAreaView>
  );
}
