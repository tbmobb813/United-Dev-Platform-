import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function createCollabDoc(room: string, serverUrl: string) {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(serverUrl, room, doc);
  return { doc, provider };
}