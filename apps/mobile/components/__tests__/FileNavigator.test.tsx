import React from 'react';
import { render } from '@testing-library/react-native';
import { FileNavigator } from '../FileNavigator';

describe('FileNavigator', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<FileNavigator />);
    expect(toJSON()).toBeTruthy();
  });
});
