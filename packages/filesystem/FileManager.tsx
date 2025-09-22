import React, { useEffect, useState } from 'react';
import type { FileSystemEntry, IFileSystem } from './types';

export interface FileManagerProps {
  fileSystem: IFileSystem;
  basePath?: string;
  onFileSelect?: (file: FileSystemEntry) => void;
  onFileOpen?: (file: FileSystemEntry) => void;
  readOnly?: boolean;
  className?: string;
}

interface FileManagerState {
  currentPath: string;
  entries: FileSystemEntry[];
  selectedFile: FileSystemEntry | null;
  loading: boolean;
  error: string | null;
  showNewFileDialog: boolean;
  showNewFolderDialog: boolean;
  newItemName: string;
}

/**
 * File Manager Component
 * Simple file management interface with basic CRUD operations
 */
export const FileManager: React.FC<FileManagerProps> = ({
  fileSystem,
  basePath = '/',
  onFileSelect,
  onFileOpen,
  readOnly = false,
  className = ''
}) => {
  const [state, setState] = useState<FileManagerState>({
    currentPath: basePath,
    entries: [],
    selectedFile: null,
    loading: false,
    error: null,
    showNewFileDialog: false,
    showNewFolderDialog: false,
    newItemName: ''
  });

  // Load directory contents
  const loadDirectory = async (path: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const listing = await fileSystem.listDirectory(path, {
        includeHidden: false,
        recursive: false
      });

      setState(prev => ({
        ...prev,
        entries: listing.entries.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        }),
        currentPath: path,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to load directory: ${error}`,
        loading: false
      }));
    }
  };

  // Initialize
  useEffect(() => {
    loadDirectory(basePath);
  }, [basePath]);

  // Navigate to parent directory
  const navigateUp = () => {
    const parentPath = fileSystem.dirname(state.currentPath);
    if (parentPath !== state.currentPath) {
      loadDirectory(parentPath);
    }
  };

  // Navigate to directory
  const navigateToDirectory = (entry: FileSystemEntry) => {
    if (entry.type === 'directory') {
      loadDirectory(entry.path);
    }
  };

  // Handle file selection
  const handleFileSelect = (entry: FileSystemEntry) => {
    setState(prev => ({ ...prev, selectedFile: entry }));
    onFileSelect?.(entry);
  };

  // Handle file double-click
  const handleFileDoubleClick = (entry: FileSystemEntry) => {
    if (entry.type === 'directory') {
      navigateToDirectory(entry);
    } else {
      onFileOpen?.(entry);
    }
  };

  // Create new file
  const createNewFile = async () => {
    if (!state.newItemName.trim()) {
      return;
    }

    try {
      const filePath = fileSystem.join(state.currentPath, state.newItemName);
      await fileSystem.writeFile(filePath, '', { createDirectories: true });
      
      setState(prev => ({
        ...prev,
        showNewFileDialog: false,
        newItemName: ''
      }));
      
      await loadDirectory(state.currentPath);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to create file: ${error}`
      }));
    }
  };

  // Create new folder
  const createNewFolder = async () => {
    if (!state.newItemName.trim()) {
      return;
    }

    try {
      const folderPath = fileSystem.join(state.currentPath, state.newItemName);
      await fileSystem.createDirectory(folderPath);
      
      setState(prev => ({
        ...prev,
        showNewFolderDialog: false,
        newItemName: ''
      }));
      
      await loadDirectory(state.currentPath);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to create folder: ${error}`
      }));
    }
  };

  // Delete selected file
  const deleteSelectedFile = async () => {
    if (!state.selectedFile) {
      return;
    }

    try {
      if (state.selectedFile.type === 'directory') {
        await fileSystem.deleteDirectory(state.selectedFile.path, true);
      } else {
        await fileSystem.deleteFile(state.selectedFile.path);
      }
      
      setState(prev => ({ ...prev, selectedFile: null }));
      await loadDirectory(state.currentPath);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to delete: ${error}`
      }));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleString();
  };

  // Get file icon
  const getFileIcon = (entry: FileSystemEntry): string => {
    if (entry.type === 'directory') {
      return '📁';
    }

    const extension = fileSystem.extname(entry.name).toLowerCase();
    
    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        return '📄';
      case '.json':
        return '⚙️';
      case '.md':
        return '📝';
      case '.css':
      case '.scss':
      case '.sass':
        return '🎨';
      case '.html':
        return '🌐';
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.svg':
        return '🖼️';
      default:
        return '📄';
    }
  };

  return (
    <div className={`file-manager ${className}`}>
      {/* Header */}
      <div className='file-manager-header'>
        <div className='breadcrumb'>
          <button
            onClick={navigateUp}
            disabled={state.currentPath === '/'}
            className='nav-button'
          >
            ↑ Up
          </button>
          <span className='current-path'>{state.currentPath}</span>
        </div>
        
        {!readOnly && (
          <div className='file-actions'>
            <button
              onClick={() => setState(prev => ({ ...prev, showNewFileDialog: true }))}
              className='action-button'
            >
              + File
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, showNewFolderDialog: true }))}
              className='action-button'
            >
              + Folder
            </button>
            {state.selectedFile && (
              <button
                onClick={deleteSelectedFile}
                className='action-button danger'
              >
                Delete
              </button>
            )}
            <button
              onClick={() => loadDirectory(state.currentPath)}
              className='action-button'
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {state.loading && (
        <div className='loading-indicator'>Loading...</div>
      )}

      {/* Error message */}
      {state.error && (
        <div className='error-message'>
          {state.error}
          <button onClick={() => setState(prev => ({ ...prev, error: null }))}>
            ✕
          </button>
        </div>
      )}

      {/* File list */}
      <div className='file-list'>
        <div className='file-list-header'>
          <span className='column-name'>Name</span>
          <span className='column-size'>Size</span>
          <span className='column-modified'>Modified</span>
        </div>
        
        {state.entries.map(entry => (
          <div
            key={entry.path}
            className={`file-item ${state.selectedFile?.path === entry.path ? 'selected' : ''}`}
            onClick={() => handleFileSelect(entry)}
            onDoubleClick={() => handleFileDoubleClick(entry)}
          >
            <span className='file-info'>
              <span className='file-icon'>{getFileIcon(entry)}</span>
              <span className='file-name'>{entry.name}</span>
            </span>
            <span className='file-size'>
              {entry.type === 'file' && entry.size !== undefined
                ? formatFileSize(entry.size)
                : '-'
              }
            </span>
            <span className='file-modified'>
              {formatDate(entry.lastModified)}
            </span>
          </div>
        ))}
      </div>

      {/* New file dialog */}
      {state.showNewFileDialog && (
        <div className='dialog-overlay'>
          <div className='dialog'>
            <h3>Create New File</h3>
            <input
              type='text'
              value={state.newItemName}
              onChange={(e) => setState(prev => ({ ...prev, newItemName: e.target.value }))}
              placeholder='Enter file name...'
              autoFocus
            />
            <div className='dialog-actions'>
              <button onClick={createNewFile}>Create</button>
              <button onClick={() => setState(prev => ({ 
                ...prev, 
                showNewFileDialog: false, 
                newItemName: '' 
              }))}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New folder dialog */}
      {state.showNewFolderDialog && (
        <div className='dialog-overlay'>
          <div className='dialog'>
            <h3>Create New Folder</h3>
            <input
              type='text'
              value={state.newItemName}
              onChange={(e) => setState(prev => ({ ...prev, newItemName: e.target.value }))}
              placeholder='Enter folder name...'
              autoFocus
            />
            <div className='dialog-actions'>
              <button onClick={createNewFolder}>Create</button>
              <button onClick={() => setState(prev => ({ 
                ...prev, 
                showNewFolderDialog: false, 
                newItemName: '' 
              }))}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;