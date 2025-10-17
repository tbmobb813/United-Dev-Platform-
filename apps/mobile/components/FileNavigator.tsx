import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FileBrowser, FileNode } from './FileBrowser';
import { FileViewer } from './FileViewer';

interface FileNavigatorProps {
  repository?: {
    id: string;
    name: string;
    owner: string;
    defaultBranch: string;
    description?: string;
  };
  readOnly?: boolean;
  showAIActions?: boolean;
}

export const FileNavigator: React.FC<FileNavigatorProps> = ({
  repository = {
    id: 'default-repo',
    name: 'Project Files',
    owner: 'user',
    defaultBranch: 'main',
    description: 'Mobile project repository',
  },
  readOnly = true,
  showAIActions = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isViewingFile, setIsViewingFile] = useState(false);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setIsViewingFile(true);
    }
  };

  const handleCloseViewer = () => {
    setIsViewingFile(false);
    setSelectedFile(null);
  };

  const handleFileEdit = (_content: string) => {
    // TODO: Implement file save logic with API call
    // For now, just store locally
    if (selectedFile) {
      // API call would go here: api.saveFile(selectedFile.path, _content)
    }
  };

  return (
    <View style={styles.container}>
      {isViewingFile && selectedFile ? (
        <FileViewer
          file={selectedFile}
          projectId={repository.id}
          onClose={handleCloseViewer}
          onEdit={handleFileEdit}
          readOnly={readOnly}
          showAIActions={showAIActions}
        />
      ) : (
        <FileBrowser
          repository={repository}
          onFileSelect={handleFileSelect}
          readOnly={readOnly}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default FileNavigator;
