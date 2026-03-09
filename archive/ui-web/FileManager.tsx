import React, { useState } from 'react';
import logger from '@udp/logger';
import { Modal } from './Modal';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Loading } from './Loading';
import { Stack } from './Layout';

export interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'open' | 'save' | 'create';
  currentFile?: string;
  onFileSelect?: (filePath: string) => void;
  onFileSave?: (filePath: string, content: string) => void;
  onFileCreate?: (filePath: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  isOpen,
  onClose,
  mode,
  currentFile = '',
  onFileSelect,
  onFileSave,
  onFileCreate,
}) => {
  const [filePath, setFilePath] = useState(currentFile);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList] = useState([
    '/README.md',
    '/package.json',
    '/src/index.js',
    '/src/components/App.js',
    '/docs/api.md',
    '/tests/unit.test.js',
  ]);

  const getTitle = () => {
    switch (mode) {
      case 'open':
        return 'Open File';
      case 'save':
        return 'Save File';
      case 'create':
        return 'Create New File';
      default:
        return 'File Manager';
    }
  };

  const handleAction = async () => {
    if (!filePath.trim() && !fileName.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const targetPath = mode === 'create' ? fileName : filePath;

      switch (mode) {
        case 'open':
          if (onFileSelect) {
            onFileSelect(filePath);
          }
          break;
        case 'save':
          if (onFileSave) {
            onFileSave(filePath, fileContent);
          }
          break;
        case 'create':
          if (onFileCreate) {
            onFileCreate(targetPath);
          }
          break;
      }

      onClose();
    } catch (error) {
      logger.error('File operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = () => {
    switch (mode) {
      case 'open':
        return 'Open';
      case 'save':
        return 'Save';
      case 'create':
        return 'Create';
      default:
        return 'OK';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size='medium'
      actions={[
        <Button key='cancel' variant='secondary' onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key='action'
          onClick={handleAction}
          disabled={isLoading || (!filePath.trim() && !fileName.trim())}
        >
          {isLoading ? <Loading /> : getActionLabel()}
        </Button>,
      ]}
    >
      <Stack gap='medium'>
        {mode === 'open' && (
          <>
            <Card title='Recent Files' padding='medium'>
              <Stack gap='small'>
                {fileList.map(file => (
                  <div
                    key={file}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                      backgroundColor: filePath === file ? '#f0f8ff' : 'white',
                    }}
                    onClick={() => setFilePath(file)}
                  >
                    {file}
                  </div>
                ))}
              </Stack>
            </Card>

            <Stack gap='small'>
              <label>File Path:</label>
              <Input
                value={filePath}
                onChange={setFilePath}
                placeholder='/path/to/file.js'
              />
            </Stack>
          </>
        )}

        {mode === 'save' && (
          <>
            <Stack gap='small'>
              <label>Save As:</label>
              <Input
                value={filePath}
                onChange={setFilePath}
                placeholder='/path/to/file.js'
              />
            </Stack>

            <Stack gap='small'>
              <label>Content Preview:</label>
              <textarea
                value={fileContent}
                onChange={e => setFileContent(e.target.value)}
                placeholder='File content...'
                style={{
                  minHeight: '100px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
            </Stack>
          </>
        )}

        {mode === 'create' && (
          <>
            <Stack gap='small'>
              <label>New File Name:</label>
              <Input
                value={fileName}
                onChange={setFileName}
                placeholder='my-component.tsx'
              />
            </Stack>

            <Card title='File Templates' padding='medium'>
              <Stack direction='row' gap='small' wrap>
                <Button
                  size='small'
                  variant='outline'
                  onClick={() => setFileName('component.tsx')}
                >
                  React Component
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  onClick={() => setFileName('utils.ts')}
                >
                  TypeScript Utility
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  onClick={() => setFileName('api.js')}
                >
                  API Route
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  onClick={() => setFileName('README.md')}
                >
                  Documentation
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  onClick={() => setFileName('test.spec.js')}
                >
                  Test File
                </Button>
              </Stack>
            </Card>
          </>
        )}

        {mode === 'open' && (
          <div style={{ fontSize: '12px', color: '#666' }}>
            💡 Tip: You can also type a file path directly or select from recent
            files above.
          </div>
        )}
      </Stack>
    </Modal>
  );
};
