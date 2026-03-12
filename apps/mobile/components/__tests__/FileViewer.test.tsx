import React from 'react';
import { render } from '@testing-library/react-native';
import { FileViewer } from '../FileViewer';

describe('FileViewer', () => {
  it('renders without crashing', () => {
    // FileViewer requires a file prop
    const file = { name: 'test.txt', path: '/test.txt', type: 'file' };
    const { toJSON } = render(
      <FileViewer file={file} onClose={() => {}} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
