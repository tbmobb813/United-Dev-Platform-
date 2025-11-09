import React, { useState } from 'react';
import { Button, Input, Stack } from '@udp/ui';

// Use generic component aliases to avoid explicit `any` while preserving JSX use
const ButtonComp = Button as React.ComponentType<Record<string, unknown>>;
const InputComp = Input as React.ComponentType<Record<string, unknown>>;
const StackComp = Stack as React.ComponentType<Record<string, unknown>>;
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
    <StackComp gap='medium'>
      <InputComp
        // @ts-ignore - treating component props as unknown during rebase
        placeholder='Enter project name'
        // @ts-ignore
        value={projectName}
        // @ts-ignore
        onChange={setProjectName}
        disabled={loading}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <StackComp direction='row' gap='small' justify='end'>
        <ButtonComp variant='ghost' onClick={onCancel} disabled={loading}>
          Cancel
        </ButtonComp>
        <ButtonComp onClick={handleSubmit} disabled={loading}>
          Create
        </ButtonComp>
      </StackComp>
    </StackComp>
  );
}
