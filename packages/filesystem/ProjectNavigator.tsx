import React, { useCallback, useEffect, useState } from 'react';
import type { FileSystemEntry, IFileSystem } from './types';

export interface ProjectNavigatorProps {
  fileSystem: IFileSystem;
  projectPath: string;
  onFileSelect?: (file: FileSystemEntry) => void;
  onFileOpen?: (file: FileSystemEntry) => void;
  className?: string;
}

interface TreeNode {
  entry: FileSystemEntry;
  children: TreeNode[];
  isExpanded: boolean;
  isLoading: boolean;
}

/**
 * Project Navigator Component
 * Simple tree view for project file structure
 */
export const ProjectNavigator: React.FC<ProjectNavigatorProps> = ({
  fileSystem,
  projectPath,
  onFileSelect,
  onFileOpen,
  className = '',
}) => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create tree node from entry
  const createTreeNode = (entry: FileSystemEntry): TreeNode => ({
    entry,
    children: [],
    isExpanded: false,
    isLoading: false,
  });

  // Load directory contents
  const loadDirectoryContents = useCallback(
    async (node: TreeNode): Promise<TreeNode[]> => {
      try {
        const listing = await fileSystem.listDirectory(node.entry.path, {
          includeHidden: false,
          recursive: false,
        });

        return listing.entries
          .sort((a, b) => {
            // Directories first, then files
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          })
          .map(createTreeNode);
      } catch (err) {
        setError(`Failed to load directory: ${err}`);
        return [];
      }
    },
    [fileSystem]
  );

  // Initialize root node
  useEffect(() => {
    const initializeRoot = async () => {
      try {
        const rootEntry = await fileSystem.getStats(projectPath);
        const node = createTreeNode(rootEntry);
        node.isExpanded = true;
        node.children = await loadDirectoryContents(node);
        setRootNode(node);
      } catch (err) {
        setError(`Failed to initialize project: ${err}`);
      }
    };

    initializeRoot();
  }, [fileSystem, projectPath, loadDirectoryContents]);

  // Toggle directory expansion
  const toggleDirectory = async (node: TreeNode) => {
    if (node.entry.type !== 'directory') {
      return;
    }

    setRootNode(prevRoot => {
      if (!prevRoot) {
        return null;
      }

      const updateNode = (current: TreeNode): TreeNode => {
        if (current.entry.path === node.entry.path) {
          const newNode = { ...current };
          if (!newNode.isExpanded && newNode.children.length === 0) {
            newNode.isLoading = true;
            // Load children asynchronously
            loadDirectoryContents(newNode).then(children => {
              setRootNode(prevRoot => {
                if (!prevRoot) {
                  return null;
                }
                const updateWithChildren = (current: TreeNode): TreeNode => {
                  if (current.entry.path === node.entry.path) {
                    return {
                      ...current,
                      children,
                      isLoading: false,
                      isExpanded: true,
                    };
                  }
                  return {
                    ...current,
                    children: current.children.map(updateWithChildren),
                  };
                };
                return updateWithChildren(prevRoot);
              });
            });
          } else {
            newNode.isExpanded = !newNode.isExpanded;
          }
          return newNode;
        }
        return {
          ...current,
          children: current.children.map(updateNode),
        };
      };

      return updateNode(prevRoot);
    });
  };

  // Handle file selection
  const handleFileSelect = (entry: FileSystemEntry) => {
    setSelectedPath(entry.path);
    onFileSelect?.(entry);
  };

  // Handle file double-click
  const handleFileDoubleClick = (entry: FileSystemEntry) => {
    if (entry.type === 'file') {
      onFileOpen?.(entry);
    }
  };

  // Render tree node
  const renderTreeNode = (
    node: TreeNode,
    level: number = 0
  ): React.ReactElement => {
    const isSelected = selectedPath === node.entry.path;
    const hasChildren = node.entry.type === 'directory';
    const indent = level * 16;

    return (
      <div key={node.entry.path} className='tree-node'>
        <div
          className={`tree-item ${isSelected ? 'selected' : ''} ${
            node.entry.type
          }`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => handleFileSelect(node.entry)}
          onDoubleClick={() => handleFileDoubleClick(node.entry)}
        >
          {hasChildren && (
            <span
              className={`tree-toggle ${node.isExpanded ? 'expanded' : ''}`}
              onClick={e => {
                e.stopPropagation();
                toggleDirectory(node);
              }}
            >
              {node.isLoading ? '⟳' : node.isExpanded ? '▼' : '▶'}
            </span>
          )}

          <span className='file-icon'>{getFileIcon(node.entry)}</span>

          <span className='file-name'>{node.entry.name}</span>
        </div>

        {hasChildren && node.isExpanded && node.children.length > 0 && (
          <div className='tree-children'>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get appropriate icon for file type
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

  if (error) {
    return (
      <div className={`project-navigator error ${className}`}>
        <div className='error-message'>
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      </div>
    );
  }

  if (!rootNode) {
    return (
      <div className={`project-navigator loading ${className}`}>
        <div className='loading-message'>Loading project...</div>
      </div>
    );
  }

  return (
    <div className={`project-navigator ${className}`}>
      <div className='project-header'>
        <h3 className='project-title'>{fileSystem.basename(projectPath)}</h3>
        <span className='project-path'>{projectPath}</span>
      </div>

      <div className='project-tree'>{renderTreeNode(rootNode)}</div>
    </div>
  );
};

export default ProjectNavigator;
