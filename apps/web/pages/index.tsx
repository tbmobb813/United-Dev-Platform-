import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<string>("/README.md");
  const deeplink = `udp://open?repo=demo&file=${encodeURIComponent(file)}&cursor=1,1`;

  const ydocRef = useRef<Y.Doc>();
  const providerRef = useRef<WebsocketProvider>();
  const ytextRef = useRef<Y.Text>();
  const ignoreRef = useRef(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:3030', 'room-demo', ydoc);
    const ytext = ydoc.getText('main');
    if (ytext.length === 0) {
      ytext.insert(0, "# Collaborative Doc\n\nType here and open the mobile app to test handoff.");
    }
    ydocRef.current = ydoc;
    providerRef.current = provider;
    ytextRef.current = ytext;
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  const handleEditorDidMount = (editor: any) => {
    const model = editor.getModel();
    if (!model || !ytextRef.current) return;
    editor.updateOptions({ wordWrap: "on", minimap: { enabled: false } });
    model.setValue(ytextRef.current.toString());

    const yObserver = () => {
      if (!ytextRef.current) return;
      if (ignoreRef.current) return;
      ignoreRef.current = true;
      model.setValue(ytextRef.current.toString());
      ignoreRef.current = false;
    };
    ytextRef.current.observe(yObserver);

    const disposable = editor.onDidChangeModelContent(() => {
      if (!ytextRef.current) return;
      if (ignoreRef.current) return;
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

  return (
    <>
      <Head>
        <title>Unified Dev Platform</title>
      </Head>
      <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1>Unified Dev Platform (Web)</h1>
        <p>Collaborative editor powered by Yjs. Y-WebSocket at <code>ws://localhost:3030</code>.</p>

        <div style={{ height: 420, border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginTop: 12 }}>
          <MonacoEditor
            height="420px"
            defaultLanguage="markdown"
            theme="vs-dark"
            onMount={handleEditorDidMount}
          />
        </div>

        <section style={{ marginTop: 24 }}>
          <h3>Mobile Handoff (QR demo)</h3>
          <p>Scan to open the same document on the mobile client via deep link:</p>
          <QRCode value={deeplink} size={140} />
          <div style={{ marginTop: 8 }}>
            <code>{deeplink}</code>
          </div>
          <div style={{ marginTop: 12 }}>
            <label>File path:&nbsp;
              <input
                value={file}
                onChange={(e) => setFile(e.target.value)}
                style={{ padding: 6, border: "1px solid #ddd", borderRadius: 6 }}
              />
            </label>
          </div>
        </section>
      </main>
    </>
  );
}
