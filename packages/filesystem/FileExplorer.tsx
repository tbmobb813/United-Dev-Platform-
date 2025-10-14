import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SyncManager } from './SyncManager';
import type { FileSystemEntry, IFileSystem } from './types';

export interface FileExplorerProps {
  fileSystem: IFileSystem;
  syncManager?: SyncManager;
  rootPath?: string;
  onFileSelect?: (file: FileSystemEntry) => void;
  onFileOpen?: (file: FileSystemEntry) => void;
  onDirectoryChange?: (path: string) => void;
  showHidden?: boolean;
  allowMultiSelect?: boolean;
  readOnly?: boolean;
  className?: string;
}

export interface FileExplorerState {
  currentPath: string;
  entries: FileSystemEntry[];
  selectedFiles: Set<string>;
  expandedDirs: Set<string>;
  loading: boolean;
  error: string | null;
  contextMenu: {
    show: boolean;
    x: number;
    y: number;
    target: FileSystemEntry | null;
  };
}

/**
 * File Explorer Component
 * Provides a tree-view interface for filesystem navigation with drag-drop support
 */
export const FileExplorer: React.FC<FileExplorerProps> = ({
  fileSystem,
  syncManager,
  rootPath = '/',
  onFileSelect,
  onFileOpen,
  onDirectoryChange,
  showHidden = false,
  allowMultiSelect = false,
  readOnly = false,
  className = '',
}) => {
  const [state, setState] = useState<FileExplorerState>({
    currentPath: rootPath,
    entries: [],
    selectedFiles: new Set(),
    expandedDirs: new Set([rootPath]),
    loading: false,
    error: null,
    contextMenu: {
      show: false,
      x: 0,
      y: 0,
      target: null,
    },
  });

  const dragCounter = useRef(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load directory contents
  const loadDirectory = useCallback(
    async (path: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const listing = await fileSystem.listDirectory(path, {
          includeHidden: showHidden,
          recursive: false,
        });

        setState(prev => ({
          ...prev,
          entries: listing.entries,
          loading: false,
          currentPath: path,
        }));

        onDirectoryChange?.(path);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: `Failed to load directory: ${error}`,
          loading: false,
        }));
      }
    },
    [fileSystem, showHidden, onDirectoryChange]
  );

  // Initialize and load root directory
  useEffect(() => {
    loadDirectory(rootPath);
  }, [loadDirectory, rootPath]);

  // Handle file selection
  const handleFileSelect = (file: FileSystemEntry, event: React.MouseEvent) => {
    const isCtrlClick = event.ctrlKey || event.metaKey;

    setState(prev => {
      const newSelected = new Set(prev.selectedFiles);

      if (allowMultiSelect && isCtrlClick) {
        if (newSelected.has(file.path)) {
          newSelected.delete(file.path);
        } else {
          newSelected.add(file.path);
        }
      } else {
        newSelected.clear();
        newSelected.add(file.path);
      }

      return { ...prev, selectedFiles: newSelected };
    });

    onFileSelect?.(file);
  };

  // Handle file double-click
  const handleFileDoubleClick = (file: FileSystemEntry) => {
    if (file.type === 'directory') {
      toggleDirectory(file.path);
    } else {
      onFileOpen?.(file);
    }
  };

  // Toggle directory expansion
  const toggleDirectory = (path: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedDirs);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
        // Load directory contents if not already loaded
        loadDirectory(path);
      }
      return { ...prev, expandedDirs: newExpanded };
    });
  };

  // Handle context menu
  const handleContextMenu = (
    event: React.MouseEvent,
    file: FileSystemEntry
  ) => {
    event.preventDefault();
    setState(prev => ({
      ...prev,
      contextMenu: {
        show: true,
        x: event.clientX,
        y: event.clientY,
        target: file,
      },
    }));
  };

  // Close context menu
  const closeContextMenu = () => {
    setState(prev => ({
      ...prev,
      contextMenu: { ...prev.contextMenu, show: false, target: null },
    }));
  };

  // Context menu actions
  const contextMenuActions = {
    open: (file: FileSystemEntry) => {
      onFileOpen?.(file);
      closeContextMenu();
    },

    rename: async (file: FileSystemEntry) => {
      const newName = prompt('Enter new name:', file.name);
      if (newName && newName !== file.name) {
        try {
          const newPath = fileSystem.join(
            fileSystem.dirname(file.path),
            newName
          );
          await fileSystem.moveFile(file.path, newPath);
          await loadDirectory(state.currentPath);
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: `Failed to rename: ${error}`,
          }));
        }
      }
      closeContextMenu();
    },

    delete: async (file: FileSystemEntry) => {
      if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
        try {
          if (file.type === 'directory') {
            await fileSystem.deleteDirectory(file.path, true);
          } else {
            await fileSystem.deleteFile(file.path);
          }
          await loadDirectory(state.currentPath);
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: `Failed to delete: ${error}`,
          }));
        }
      }
      closeContextMenu();
    },

    newFile: async () => {
      const fileName = prompt('Enter file name:');
      if (fileName) {
        try {
          const filePath = fileSystem.join(state.currentPath, fileName);
          await fileSystem.writeFile(filePath, '', { createDirectories: true });
          await loadDirectory(state.currentPath);
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: `Failed to create file: ${error}`,
          }));
        }
      }
      closeContextMenu();
    },

    newFolder: async () => {
      const folderName = prompt('Enter folder name:');
      if (folderName) {
        try {
          const folderPath = fileSystem.join(state.currentPath, folderName);
          await fileSystem.createDirectory(folderPath);
          await loadDirectory(state.currentPath);
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: `Failed to create folder: ${error}`,
          }));
        }
      }
      closeContextMenu();
    },
  };

  // Drag and drop handlers
  const handleDragStart = (event: React.DragEvent, file: FileSystemEntry) => {
    event.dataTransfer.setData('text/plain', file.path);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    dragCounter.current++;
    setState(prev => ({ ...prev, dragOver: true }));
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setState(prev => ({ ...prev, dragOver: false }));
    }
  };

  const handleDrop = async (
    event: React.DragEvent,
    targetDir?: FileSystemEntry
  ) => {
    event.preventDefault();
    dragCounter.current = 0;
    setState(prev => ({ ...prev, dragOver: false }));

    const sourcePath = event.dataTransfer.getData('text/plain');
    const targetPath = targetDir?.path || state.currentPath;

    if (sourcePath && sourcePath !== targetPath) {
      try {
        const fileName = fileSystem.basename(sourcePath);
        const newPath = fileSystem.join(targetPath, fileName);
        await fileSystem.moveFile(sourcePath, newPath);
        await loadDirectory(state.currentPath);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: `Failed to move file: ${error}`,
        }));
      }
    }
  };

  // Render file/directory entry
  const renderEntry = (entry: FileSystemEntry, level: number = 0) => {
    const isSelected = state.selectedFiles.has(entry.path);
    const isExpanded = state.expandedDirs.has(entry.path);
    const indent = level * 20;

    return (
      <div key={entry.path} className='file-entry-container'>
        <div
          className={`file-entry ${isSelected ? 'selected' : ''} ${entry.type}`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={e => handleFileSelect(entry, e)}
          onDoubleClick={() => handleFileDoubleClick(entry)}
          onContextMenu={e => handleContextMenu(e, entry)}
          draggable={!readOnly}
          onDragStart={e => handleDragStart(e, entry)}
          onDragOver={handleDragOver}
          onDrop={e =>
            handleDrop(e, entry.type === 'directory' ? entry : undefined)
          }
        >
          {entry.type === 'directory' && (
            <span
              className={`directory-toggle ${isExpanded ? 'expanded' : ''}`}
              onClick={e => {
                e.stopPropagation();
                toggleDirectory(entry.path);
              }}
            >
              ▶
            </span>
          )}

          <span className='file-icon'>
            {entry.type === 'directory' ? '📁' : '📄'}
          </span>

          <span className='file-name'>{entry.name}</span>

          {entry.size !== undefined && entry.type === 'file' && (
            <span className='file-size'>{formatFileSize(entry.size)}</span>
          )}
        </div>

        {entry.type === 'directory' && isExpanded && (
          <div className='directory-contents'>
            {state.entries
              .filter(child => fileSystem.dirname(child.path) === entry.path)
              .map(child => renderEntry(child, level + 1))}
          </div>
        )}
      </div>
    );
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

  return (
    <div
      className={`file-explorer ${className}`}
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={e => handleDrop(e)}
      onClick={closeContextMenu}
    >
      {/* Header */}
      <div className='file-explorer-header'>
        <div className='breadcrumb'>
          {state.currentPath
            .split('/')
            .filter(Boolean)
            .map((segment, index, arr) => {
              const path = '/' + arr.slice(0, index + 1).join('/');
              return (
                <span key={path} className='breadcrumb-segment'>
                  <button
                    onClick={() => loadDirectory(path)}
                    className='breadcrumb-button'
                  >
                    {segment}
                  </button>
                  {index < arr.length - 1 && (
                    <span className='breadcrumb-separator'>/</span>
                  )}
                </span>
              );
            })}
        </div>

        {!readOnly && (
          <div className='file-explorer-actions'>
            <button
              onClick={() => contextMenuActions.newFile()}
              title='New File'
            >
              📄+
            </button>
            <button
              onClick={() => contextMenuActions.newFolder()}
              title='New Folder'
            >
              📁+
            </button>
            <button
              onClick={() => loadDirectory(state.currentPath)}
              title='Refresh'
            >
              🔄
            </button>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {state.loading && <div className='loading-indicator'>Loading...</div>}

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
        {state.entries
          .filter(entry => fileSystem.dirname(entry.path) === state.currentPath)
          .sort((a, b) => {
            // Directories first, then files
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          })
          .map(entry => renderEntry(entry))}
      </div>

      {/* Context menu */}
      {state.contextMenu.show && state.contextMenu.target && (
        <div
          className='context-menu'
          style={{
            position: 'fixed',
            left: state.contextMenu.x,
            top: state.contextMenu.y,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => contextMenuActions.open(state.contextMenu.target!)}
          >
            Open
          </button>
          {!readOnly && (
            <>
              <button
                onClick={() =>
                  contextMenuActions.rename(state.contextMenu.target!)
                }
              >
                Rename
              </button>
              <button
                onClick={() =>
                  contextMenuActions.delete(state.contextMenu.target!)
                }
              >
                Delete
              </button>
              <hr />
              <button onClick={() => contextMenuActions.newFile()}>
                New File
              </button>
              <button onClick={() => contextMenuActions.newFolder()}>
                New Folder
              </button>
            </>
          )}
        </div>
      )}

      {/* Selection info */}
      {state.selectedFiles.size > 0 && (
        <div className='selection-info'>
          {state.selectedFiles.size} item(s) selected
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
