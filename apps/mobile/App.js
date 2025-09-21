import * as Linking from "expo-linking";
import { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, TextInput } from "react-native";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function App() {
  const [params, setParams] = useState({
    repo: "",
    file: "",
    cursor: "",
    room: "default-room",
    doc: "main-document",
  });
  const [content, setContent] = useState("");
  const ydocRef = useRef();
  const ytextRef = useRef();

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { queryParams } = Linking.parse(url);
      setParams({
        repo: queryParams.repo || "",
        file: queryParams.file || "",
        cursor: queryParams.cursor || "",
        room: queryParams.room || "default-room",
        doc: queryParams.doc || "main-document",
      });
    };
    const sub = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const docId = `${params.room}-${params.doc}`;
    const doc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:3030", docId, doc);
    const ytext = doc.getText(params.doc);

    // Set initial content if document is empty
    if (ytext.length === 0) {
      ytext.insert(
        0,
        `# ${params.doc}\n\nMobile editing in room: ${params.room}\nDocument: ${params.doc}`
      );
    }

    ytext.observe(() => {
      setContent(ytext.toString());
    });

    // Set initial content from document
    setContent(ytext.toString());

    ydocRef.current = doc;
    ytextRef.current = ytext;
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [params.room, params.doc]);

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
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>UDP Mobile</Text>
      <Text>Repo: {params.repo}</Text>
      <Text>File: {params.file}</Text>
      <Text>Room: {params.room}</Text>
      <Text>Document: {params.doc}</Text>
      <Text style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Real-time collaborative editing with web app
      </Text>
      <TextInput
        style={{
          marginTop: 12,
          height: 200,
          borderColor: "#ccc",
          borderWidth: 1,
          padding: 8,
          textAlignVertical: "top",
        }}
        multiline
        placeholder={`Start typing in the ${params.doc} document...`}
        value={content}
        onChangeText={handleChange}
      />
      <Text style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
        Changes sync in real-time with web editor
      </Text>
    </SafeAreaView>
  );
}
