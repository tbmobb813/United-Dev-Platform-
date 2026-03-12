import React from 'react';
import { render, act } from '@testing-library/react-native';
import CollaborativeEditor from '../CollaborativeEditor';

describe('CollaborativeEditor', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <CollaborativeEditor
        roomId="test-room"
        userId="user-1"
        userName="Test User"
      />
    );
    // Just check the component renders a View
    expect(getByTestId('collaborative-editor-root')).toBeTruthy();
  });

  it('shows error if connection fails', async () => {
    // TODO: mock DocumentManager to throw
    // For now, just render and check error boundary
    const { findByText } = render(
      <CollaborativeEditor
        roomId="bad-room"
        userId="user-1"
        userName="Test User"
      />
    );
    // This will need a mock to actually trigger error
    // expect(await findByText(/Failed to connect/)).toBeTruthy();
  });
});
