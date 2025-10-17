import { Button, Card, Loading, Stack } from '@udp/ui-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AIService, ApiService } from '../services';
import { FileNode } from './FileBrowser';

interface FileViewerProps {
  file: FileNode;
  projectId?: string; // Add project ID for API calls
  onClose: () => void;
  onEdit?: (content: string) => void;
  readOnly?: boolean;
  showAIActions?: boolean;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  file,
  projectId,
  onClose,
  onEdit,
  readOnly = true,
  showAIActions = true,
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  useEffect(() => {
    loadFileContent();
  }, [file.path]);

  const loadFileContent = async () => {
    setLoading(true);
    try {
      // Try to load content from API if file has ID and projectId
      if (file.id && projectId) {
        const response = await ApiService.getMobileFileContent(
          projectId,
          file.id
        );

        if (response.error) {
          Alert.alert('Error', response.error);
          return;
        }

        if (response.data !== undefined) {
          setContent(response.data);
          setEditedContent(response.data);
          return;
        }
      }

      // Fallback to existing content or mock data
      if (file.content !== undefined) {
        setContent(file.content);
        setEditedContent(file.content);
      } else {
        const mockContent = await getMockFileContent(file);
        setContent(mockContent);
        setEditedContent(mockContent);
      }
    } catch {
      Alert.alert('Error', 'Failed to load file content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Try to save via API if file has ID and projectId
      if (file.id && projectId) {
        const response = await ApiService.saveMobileFileContent(
          projectId,
          file.id,
          editedContent
        );

        if (response.error) {
          Alert.alert('Error', `Failed to save: ${response.error}`);
          return;
        }

        Alert.alert('Success', 'File saved successfully!');
      }

      // Update local state and call parent handler
      onEdit?.(editedContent);
      setContent(editedContent);
      setIsEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to save file');
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleAIAction = async (
    action: 'explain' | 'test' | 'optimize' | 'summarize'
  ) => {
    if (!content.trim()) {
      Alert.alert('No Content', 'No file content to analyze');
      return;
    }

    setAiLoading(true);
    setAiResponse('');

    try {
      let aiStream;
      const fileName = file.name;
      const language = file.language;

      switch (action) {
        case 'explain':
          aiStream = AIService.explainCode(content, fileName, language);
          break;
        case 'test':
          aiStream = AIService.generateTests(content, fileName, language);
          break;
        case 'optimize':
          aiStream = AIService.optimizeCode(content, fileName, language);
          break;
        case 'summarize':
          aiStream = AIService.summarizeCode(content, fileName, language);
          break;
        default:
          throw new Error('Unknown AI action');
      }

      let accumulatedResponse = '';
      const aiGenerator = await aiStream;
      for await (const response of aiGenerator) {
        accumulatedResponse = response.content;
        setAiResponse(accumulatedResponse);

        if (response.error) {
          Alert.alert('AI Error', response.error);
          break;
        }

        if (response.finished) {
          break;
        }
      }

      // Show the AI response in a modal/alert for now
      if (accumulatedResponse) {
        Alert.alert(
          `AI ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          accumulatedResponse,
          [{ text: 'OK' }]
        );
      }
    } catch {
      Alert.alert('Error', `AI ${action} failed`);
    } finally {
      setAiLoading(false);
    }
  };

  const getFileLanguage = (): string => {
    const ext = file.extension?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      css: 'css',
      html: 'html',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
    };
    return languageMap[ext || ''] || 'text';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading text='Loading file...' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with file info */}
      <Card title={`📄 ${file.name}`} padding='medium' style={{}}>
        <Stack gap='small' style={{}}>
          <View style={styles.fileInfo}>
            <Text style={styles.filePath}>{file.path}</Text>
            <View style={styles.fileMetadata}>
              <Text style={styles.metadataText}>
                {file.language || getFileLanguage()}
              </Text>
              {file.size && (
                <Text style={styles.metadataText}>
                  • {formatFileSize(file.size)}
                </Text>
              )}
            </View>
          </View>

          {/* Action buttons */}
          <Stack direction='row' gap='small' style={{}}>
            <Button
              title='⬅️ Back'
              onPress={onClose}
              variant='secondary'
              size='small'
              style={{}}
            />
            {!readOnly && !isEditing && (
              <Button
                title='✏️ Edit'
                onPress={handleEdit}
                size='small'
                style={{}}
              />
            )}
            {isEditing && (
              <>
                <Button
                  title='💾 Save'
                  onPress={handleSave}
                  size='small'
                  style={{}}
                />
                <Button
                  title='❌ Cancel'
                  onPress={handleCancel}
                  variant='secondary'
                  size='small'
                  style={{}}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* File content */}
      <View style={styles.contentContainer}>
        {isEditing ? (
          <TextInput
            style={styles.editor}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            placeholder='Start typing...'
            scrollEnabled
          />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
            <Text style={styles.viewer}>{content}</Text>
          </ScrollView>
        )}
      </View>

      {/* AI Actions Footer */}
      {showAIActions && (
        <View style={styles.aiActions}>
          <Stack direction='row' gap='small' style={{}}>
            <Button
              title='🤖 Explain'
              onPress={() => handleAIAction('explain')}
              size='small'
              variant='outline'
              style={{}}
              disabled={aiLoading}
            />
            <Button
              title='🧪 Tests'
              onPress={() => handleAIAction('test')}
              size='small'
              variant='outline'
              style={{}}
              disabled={aiLoading}
            />
            <Button
              title='⚡ Optimize'
              onPress={() => handleAIAction('optimize')}
              size='small'
              variant='outline'
              style={{}}
              disabled={aiLoading}
            />
          </Stack>
          {aiLoading && (
            <View style={styles.aiLoadingContainer}>
              <Loading text='AI processing...' />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Mock function to simulate loading file content
async function getMockFileContent(file: FileNode): Promise<string> {
  // TODO: Replace with actual API call
  const extension = file.extension?.toLowerCase();

  switch (extension) {
    case 'tsx':
    case 'jsx':
      return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ${file.name.replace('.tsx', '').replace('.jsx', '')}Props {
  title: string;
  onPress?: () => void;
}

export const ${file.name
        .replace('.tsx', '')
        .replace('.jsx', '')}: React.FC<${file.name
        .replace('.tsx', '')
        .replace('.jsx', '')}Props> = ({
  title,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});`;

    case 'ts':
      return `export interface ${file.name.replace('.ts', '')} {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ${file.name.replace('.ts', '')}Service {
  async findById(id: string): Promise<${file.name.replace('.ts', '')} | null> {
    // Implementation here
    return null;
  }

  async create(data: Partial<${file.name.replace(
    '.ts',
    ''
  )}>): Promise<${file.name.replace('.ts', '')}> {
    // Implementation here
    throw new Error('Not implemented');
  }
}`;

    case 'json':
      return `{
  "name": "@udp/mobile",
  "version": "1.0.0",
  "description": "Mobile app for United Development Platform",
  "main": "App.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.0",
    "expo": "^51.0.0"
  }
}`;

    case 'md':
      return `# ${file.name.replace('.md', '')}

This is a sample markdown file showing the file viewer capabilities.

## Features

- **Syntax highlighting** for multiple languages
- **Read-only and edit modes** 
- **AI-powered actions** for code assistance
- **Mobile-optimized interface**

## Code Example

\`\`\`typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
}
\`\`\`

## Links

- [Documentation](https://docs.example.com)
- [GitHub Repository](https://github.com/example/repo)`;

    default:
      return `This is a sample file: ${file.name}

Path: ${file.path}
Type: ${file.type}
Language: ${file.language || 'Unknown'}

This file viewer supports syntax highlighting for multiple programming languages
and provides a mobile-optimized reading and editing experience.

TODO: Replace this mock content with actual file content from your backend API.`;
  }
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
  fileInfo: {
    gap: 8,
  },
  filePath: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  fileMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  editor: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 16,
    textAlignVertical: 'top',
    color: '#333333',
  },
  viewer: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 16,
    color: '#333333',
    lineHeight: 20,
  },
  aiActions: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  aiLoadingContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
});

export default FileViewer;
