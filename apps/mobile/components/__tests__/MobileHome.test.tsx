import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import MobileHome from '../MobileHome';
import * as YjsFilesHook from '../../hooks/useYjsFiles';

jest.mock('../../hooks/useYjsFiles', () => ({
  useYjsFiles: jest.fn(() => ({
    files: [],
    isConnected: false,
    error: null,
    getFileContent: jest.fn(),
  })),
}));

jest.mock('../../hooks/useDevicePairing', () => ({
  useDevicePairing: jest.fn(() => ({
    state: { status: 'idle' },
    register: jest.fn(),
    reset: jest.fn(),
  })),
}));

// Lightweight stand-in so CollaborativeEditor doesn't attempt real Yjs/WS work
jest.mock('../CollaborativeEditor', () => ({
  CollaborativeEditor: () => null,
}));

describe('MobileHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: not connected, no pairingData
    (YjsFilesHook.useYjsFiles as jest.Mock).mockReturnValue({
      files: [],
      isConnected: false,
      error: null,
      getFileContent: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<MobileHome />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows "Not Connected" fallback on the Edit tab when isConnected is true but pairingData is null', () => {
    // Simulate the race condition: WebSocket connected to default localhost
    // before the user completes the pairing flow (pairingData remains null).
    (YjsFilesHook.useYjsFiles as jest.Mock).mockReturnValue({
      files: [],
      isConnected: true,
      error: null,
      getFileContent: jest.fn(),
    });

    const { getByText, queryByTestId } = render(<MobileHome />);

    // Navigate to the Edit tab
    fireEvent.press(getByText('Edit'));

    // The fallback "Not Connected" UI should be shown…
    expect(getByText('Not Connected')).toBeTruthy();
    // …and CollaborativeEditor must NOT have been rendered
    expect(queryByTestId('collaborative-editor-root')).toBeNull();
  });
});
