import React, { useState } from 'react';
import { Button, Input, Stack } from '@udp/ui';

// Cast UI exports to any to avoid cross-package React typing mismatch during rebase
const ButtonAny: any = Button;
const InputAny: any = Input;
const StackAny: any = Stack;
import axios from 'axios';

interface CreateProjectFormProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export default function CreateProjectForm({
  onProjectCreated,
  onCancel,
}: CreateProjectFormProps) {
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/projects', {
        name: projectName,
        description: 'New project created from web app',
        visibility: 'PRIVATE', // Default to private
      });
      onProjectCreated(response.data.project.id);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StackAny gap='medium'>
      <InputAny
        placeholder='Enter project name'
        value={projectName}
        onChange={setProjectName}
        disabled={loading}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <StackAny direction='row' gap='small' justify='end'>
        <ButtonAny variant='ghost' onClick={onCancel} disabled={loading}>
          Cancel
        </ButtonAny>
        <ButtonAny onClick={handleSubmit} disabled={loading}>
          Create
        </ButtonAny>
      </StackAny>
    </StackAny>
  );
}
