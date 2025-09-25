export interface UserPresence {
  id: string;
  name: string;
  color: string;
  lastSeen: Date;
  isActive: boolean;
}

export interface DocumentState {
  content: string;
  lastModified: Date;
  version: number;
}

export interface CollaborationSettings {
  autoSave: boolean;
  syncInterval: number;
  connectionTimeout: number;
}
