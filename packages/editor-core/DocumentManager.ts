import { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { UserPresence } from './types';

export class DocumentManager {
  private doc: Y.Doc;
  private provider: WebsocketProvider | null = null;
  private awareness: Awareness;
  private user: Omit<UserPresence, 'lastSeen' | 'isActive'>;
  private wsUrl: string;
  private collaboratorsCallback?: (users: UserPresence[]) => void;

  constructor(
    user: Omit<UserPresence, 'lastSeen' | 'isActive'>,
    wsUrl: string
  ) {
    this.user = user;
    this.wsUrl = wsUrl;
    this.doc = new Y.Doc();
    this.awareness = new Awareness(this.doc);

    // Set initial user state
    this.awareness.setLocalState({
      ...user,
      lastSeen: new Date(),
      isActive: true,
    });

    // Listen for awareness changes
    this.awareness.on('change', () => {
      if (this.collaboratorsCallback) {
        this.collaboratorsCallback(this.getConnectedUsers());
      }
    });
  }

  async openDocument(
    roomId: string,
    documentId: string
  ): Promise<{ content: Y.Text; awareness: Awareness }> {
    // Create provider for this specific document
    const docName = `${roomId}-${documentId}`;
    this.provider = new WebsocketProvider(this.wsUrl, docName, this.doc);

    // Wait for connection
    await new Promise<void>(resolve => {
      if (this.provider) {
        this.provider.on('status', (event: { status: string }) => {
          if (event.status === 'connected') {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });

    const content = this.doc.getText(documentId);

    return {
      content,
      awareness: this.awareness,
    };
  }

  updateUserPresence(updates: Partial<UserPresence>): void {
    const currentState = this.awareness.getLocalState() as UserPresence;
    this.awareness.setLocalState({
      ...currentState,
      ...updates,
      lastSeen: new Date(),
      isActive: true,
    });
  }

  getConnectedUsers(): UserPresence[] {
    const states = this.awareness.getStates();
    return Array.from(states.values()) as UserPresence[];
  }

  onCollaboratorsChanged(callback: (users: UserPresence[]) => void): void {
    this.collaboratorsCallback = callback;
    // Immediately call with current users
    callback(this.getConnectedUsers());
  }

  destroy(): void {
    if (this.provider) {
      this.provider.destroy();
    }
    this.doc.destroy();
  }
}
