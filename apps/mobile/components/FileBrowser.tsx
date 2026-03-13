import { Button, Card, Loading, Stack } from '@udp/ui-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ApiService, MobileFileNode, MobileRepository } from '../services';
import type { YjsFileEntry } from '../hooks/useYjsFiles';

// Re-export types for backward compatibility
export interface FileNode extends MobileFileNode {}
export interface Repository extends MobileRepository {}

interface FileBrowserProps {
  repository?: Repository;
  initialPath?: string;
  onFileSelect: (file: FileNode) => void;
  onDirectorySelect?: (directory: FileNode) => void;
  showAIActions?: boolean;
  readOnly?: boolean;
  yjsFiles?: YjsFileEntry[];
}

// Helper function to convert Yjs file entries to FileNode format
function convertYjsFilesToFileNodes(yjsFiles: YjsFileEntry[]): FileNode[] {
  return yjsFiles.map(entry => ({
    name: entry.path.split('/').pop() || entry.path,
    path: entry.path,
    type: entry.type,
    children: entry.children
      ? convertYjsFilesToFileNodes(entry.children)
      : undefined,
    extension: entry.type === 'file' ? entry.path.split('.').pop() : undefined,
    size: undefined,
  }));
}

// Helper function to filter files by current path
function filterFilesByPath(files: FileNode[], currentPath: string): FileNode[] {
  if (currentPath === '/') {
    return files;
  }

  // Find the node at the current path
  const pathParts = currentPath.split('/').filter(p => p);
  let current: FileNode | undefined;

  for (const part of pathParts) {
    if (!current) {
      current = files.find(f => f.name === part);
    } else {
      current = current.children?.find(f => f.name === part);
    }

    if (!current) {
      return [];
    }
  }

  return current?.children || [];
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  repository,
  initialPath = '/',
  onFileSelect,
  onDirectorySelect,
  showAIActions = true,
  readOnly: _readOnly = true,
  yjsFiles,
}) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, repository, yjsFiles]);

  const loadFiles = async (path: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (yjsFiles) {
        // Use Yjs files from sync manager
        const fileNodes = convertYjsFilesToFileNodes(yjsFiles);
        setFiles(filterFilesByPath(fileNodes, path));
      } else if (repository?.id) {
        // Use real API to load files
        const response = await ApiService.getMobileFileTree(
          repository.id,
          path === '/' ? undefined : path
        );

        if (response.error) {
          Alert.alert('Error', response.error);
          return;
        }

        if (response.data) {
          setFiles(response.data);
        }
      } else {
        // Fallback to mock data if no repository ID
        const mockFiles = await getMockFileStructure(path, repository);
        setFiles(mockFiles);
      }
    } catch {
      Alert.alert('Error', 'Failed to load files');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadFiles(currentPath, true);
  };

  const toggleDirectory = (directory: FileNode) => {
    const newExpandedDirs = new Set(expandedDirs);

    if (expandedDirs.has(directory.path)) {
      newExpandedDirs.delete(directory.path);
    } else {
      newExpandedDirs.add(directory.path);
    }

    setExpandedDirs(newExpandedDirs);
    onDirectorySelect?.(directory);
  };

  const handleFilePress = (file: FileNode) => {
    if (file.type === 'directory') {
      toggleDirectory(file);
    } else {
      onFileSelect(file);
    }
  };

  const navigateUp = () => {
    if (currentPath !== '/') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      setCurrentPath(parentPath);
    }
  };

  const getFileIcon = (file: FileNode): string => {
    if (file.type === 'directory') {
      return expandedDirs.has(file.path) ? '📂' : '📁';
    }

    // File type icons based on extension
    const extension = file.extension?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return '📄';
      case 'ts':
      case 'tsx':
        return '📘';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'css':
      case 'scss':
        return '🎨';
      case 'html':
        return '🌐';
      case 'py':
        return '🐍';
      case 'java':
        return '☕';
      case 'png':
      case 'jpg':
      case 'svg':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const getLanguageFromExtension = (extension: string): string => {
    const langMap: Record<string, string> = {
      js: 'JavaScript',
      jsx: 'JavaScript React',
      ts: 'TypeScript',
      tsx: 'TypeScript React',
      py: 'Python',
      java: 'Java',
      css: 'CSS',
      scss: 'SCSS',
      html: 'HTML',
      json: 'JSON',
      md: 'Markdown',
      yml: 'YAML',
      yaml: 'YAML',
    };
    return langMap[extension.toLowerCase()] || 'Text';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) {
      return '';
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)}KB`;
    }
    return `${(kb / 1024).toFixed(1)}MB`;
  };

  const renderFile = ({ item }: { item: FileNode }) => {
    const isExpanded = expandedDirs.has(item.path);
    const indentLevel = (item.path.split('/').length - 2) * 16;

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.fileItem,
            { paddingLeft: Math.max(16, indentLevel) },
            item.type === 'directory' && styles.directoryItem,
          ]}
          onPress={() => handleFilePress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.fileContent}>
            <Text style={styles.fileIcon}>{getFileIcon(item)}</Text>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.type === 'file' && (
                <View style={styles.fileMetadata}>
                  <Text style={styles.fileLanguage}>
                    {item.extension
                      ? getLanguageFromExtension(item.extension)
                      : 'Unknown'}
                  </Text>
                  {item.size && (
                    <Text style={styles.fileSize}>
                      • {formatFileSize(item.size)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {item.type === 'directory' && (
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          )}
        </TouchableOpacity>

        {/* Render children if directory is expanded */}
        {item.type === 'directory' && isExpanded && item.children && (
          <FlatList
            data={item.children}
            renderItem={renderFile}
            keyExtractor={child => child.path}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Loading text='Loading files...' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with repo info and navigation */}
      <Card title='📁 File Browser' padding='medium' style={{}}>
        <Stack gap='small' style={{}}>
          {repository && (
            <View style={styles.repoInfo}>
              <Text style={styles.repoName}>
                {repository.owner}/{repository.name}
              </Text>
              <Text style={styles.repoBranch}>
                📋 {repository.defaultBranch}
              </Text>
            </View>
          )}

          <View style={styles.pathNavigation}>
            <TouchableOpacity
              style={styles.pathButton}
              onPress={navigateUp}
              disabled={currentPath === '/'}
            >
              <Text style={styles.pathButtonText}>↑ Parent</Text>
            </TouchableOpacity>
            <Text style={styles.currentPath} numberOfLines={1}>
              {currentPath}
            </Text>
          </View>
        </Stack>
      </Card>

      {/* File list */}
      <View style={styles.fileListContainer}>
        <FlatList
          data={files}
          renderItem={renderFile}
          keyExtractor={item => item.path}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          style={styles.fileList}
          showsVerticalScrollIndicator={true}
        />
      </View>

      {/* Quick Actions Footer */}
      {showAIActions && (
        <View style={styles.quickActions}>
          <Stack direction='row' gap='small' style={{}}>
            <Button
              title='🤖 AI Summary'
              size='small'
              onPress={() => {}}
              style={{}}
            />
            <Button
              title='📊 Code Stats'
              size='small'
              onPress={() => {}}
              style={{}}
            />
            <Button
              title='🔍 Search Files'
              size='small'
              onPress={() => {}}
              style={{}}
            />
          </Stack>
        </View>
      )}
    </View>
  );
};

// Mock data function - replace with actual API calls
async function getMockFileStructure(
  _path: string,
  _repository?: Repository
): Promise<FileNode[]> {
  // TODO: Replace with actual API call to backend
  // For now, return mock data immediately

  // Mock file structure for demonstration
  const mockFiles: FileNode[] = [
    {
      name: 'src',
      path: '/src',
      type: 'directory',
      children: [
        {
          name: 'components',
          path: '/src/components',
          type: 'directory',
          children: [
            {
              name: 'Button.tsx',
              path: '/src/components/Button.tsx',
              type: 'file',
              size: 2048,
              extension: 'tsx',
              language: 'TypeScript React',
            },
            {
              name: 'Modal.tsx',
              path: '/src/components/Modal.tsx',
              type: 'file',
              size: 3584,
              extension: 'tsx',
              language: 'TypeScript React',
            },
          ],
        },
        {
          name: 'utils',
          path: '/src/utils',
          type: 'directory',
          children: [
            {
              name: 'api.ts',
              path: '/src/utils/api.ts',
              type: 'file',
              size: 1536,
              extension: 'ts',
              language: 'TypeScript',
            },
          ],
        },
        {
          name: 'App.tsx',
          path: '/src/App.tsx',
          type: 'file',
          size: 4096,
          extension: 'tsx',
          language: 'TypeScript React',
        },
      ],
    },
    {
      name: 'package.json',
      path: '/package.json',
      type: 'file',
      size: 1024,
      extension: 'json',
      language: 'JSON',
    },
    {
      name: 'README.md',
      path: '/README.md',
      type: 'file',
      size: 2048,
      extension: 'md',
      language: 'Markdown',
    },
    {
      name: 'node_modules',
      path: '/node_modules',
      type: 'directory',
      children: [], // Usually skip node_modules content
    },
  ];

  return mockFiles;
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
  repoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  repoBranch: {
    fontSize: 14,
    color: '#6b7280',
  },
  pathNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pathButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  pathButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  currentPath: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  fileListContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  directoryItem: {
    backgroundColor: '#fafbfc',
  },
  fileContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIcon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  fileMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileLanguage: {
    fontSize: 12,
    color: '#6b7280',
  },
  fileSize: {
    fontSize: 12,
    color: '#9ca3af',
  },
  expandIcon: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  quickActions: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

export default FileBrowser;
