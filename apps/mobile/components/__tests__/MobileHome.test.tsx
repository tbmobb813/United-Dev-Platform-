import React from 'react';
import { render } from '@testing-library/react-native';
import MobileHome from '../MobileHome';

describe('MobileHome', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MobileHome />);
    expect(toJSON()).toBeTruthy();
  });
});
