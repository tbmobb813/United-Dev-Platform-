import React from 'react';
import { render } from '@testing-library/react-native';
import { FileBrowser } from '../FileBrowser';

describe('FileBrowser', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <FileBrowser onFileSelect={() => {}} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
