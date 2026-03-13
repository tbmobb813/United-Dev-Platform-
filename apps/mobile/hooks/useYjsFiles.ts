import { DocumentManager } from '@udp/editor-core';
import * as Y from '@udp/editor-core/yjs-singleton';
import { useEffect, useRef, useState } from 'react';

export interface YjsFileEntry {
  path: string;
  type: 'file' | 'directory';
  children?: YjsFileEntry[];
}

interface FileNode {
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export function useYjsFiles(serverIp: string, port: number, roomId: string) {
  const [files, setFiles] = useState<YjsFileEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docManagerRef = useRef<DocumentManager | null>(null);
  const filesMapRef = useRef<Y.Map<unknown> | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const initializeYjs = async () => {
      try {
        setError(null);

        // Create document manager with mobile user identity
        docManagerRef.current = new DocumentManager(
          {
            id: 'mobile-user',
            name: 'Mobile',
            color: '#0066cc',
          },
          `ws://${serverIp}:${port}`
        );

        // Open the files document
        const doc = await docManagerRef.current.openDocument(roomId, 'files');

        if (isUnmounted) {
          return;
        }

        // Get the files Y.Map from the document
        // The ProjectSyncManager stores files in a Y.Map at doc.getMap('files')
        filesMapRef.current = doc.getMap('files');

        // Convert the Y.Map to a file tree structure
        const initialFiles = convertYMapToFileTree(filesMapRef.current);
        if (!isUnmounted) {
          setFiles(initialFiles);
          setIsConnected(true);
        }

        // Observe changes to the files map
        const updateHandler = () => {
          if (!isUnmounted) {
            const updatedFiles = convertYMapToFileTree(filesMapRef.current!);
            setFiles(updatedFiles);
          }
        };

        filesMapRef.current.observe(updateHandler);

        return () => {
          filesMapRef.current?.unobserve(updateHandler);
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (!isUnmounted) {
          setError(message);
          setIsConnected(false);
        }
      }
    };

    initializeYjs();

    return () => {
      isUnmounted = true;
      docManagerRef.current?.destroy();
    };
  }, [serverIp, port, roomId]);

  const convertYMapToFileTree = (ymap: Y.Map<unknown>): YjsFileEntry[] => {
    const entries: YjsFileEntry[] = [];

    ymap.forEach(value => {
      const v = value as Record<string, unknown> | undefined;
      if (v && typeof v === 'object' && 'type' in v && 'path' in v) {
        entries.push({
          path: String(v.path),
          type: (v.type as 'file' | 'directory') || 'file',
          children: v.children
            ? (v.children as unknown[]).map(child => {
                const c = child as Record<string, unknown>;
                return {
                  path: String(c.path),
                  type: (c.type as 'file' | 'directory') || 'file',
                };
              })
            : undefined,
        });
      }
    });

    return entries;
  };

  const getFileContent = async (path: string): Promise<string> => {
    try {
      if (!filesMapRef.current) {
        throw new Error('Files map not initialized');
      }

      // Try to find the file content in the Y.Map
      // Files can be stored as Y.Text objects keyed by path
      const contentKey = `${path}:content`;
      const ytext = filesMapRef.current.get(contentKey);

      if (ytext instanceof Y.Text) {
        return ytext.toString();
      }

      // Fallback: try to fetch from the raw map entry
      const fileEntry = filesMapRef.current.get(path);
      if (fileEntry && typeof fileEntry === 'object' && fileEntry.content) {
        return fileEntry.content as string;
      }

      throw new Error(`File content not found for ${path}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Failed to get file content: ${message}`);
    }
  };

  const buildNestedTree = (entries: YjsFileEntry[]): YjsFileEntry[] => {
    const map = new Map<string, YjsFileEntry>();

    // First pass: create all entries
    for (const entry of entries) {
      map.set(entry.path, { ...entry, children: [] });
    }

    // Second pass: build tree structure
    const roots: YjsFileEntry[] = [];

    for (const entry of entries) {
      const pathParts = entry.path.split('/').filter(p => p);
      const parentPath = pathParts.slice(0, -1).join('/');

      if (!parentPath) {
        // Root level
        roots.push(map.get(entry.path)!);
      } else {
        const parent = map.get(parentPath);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(map.get(entry.path)!);
        }
      }
    }

    return roots;
  };

  return { files: buildNestedTree(files), isConnected, error, getFileContent };
}

// Re-export types
export type { FileNode };
