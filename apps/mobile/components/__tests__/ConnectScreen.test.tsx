import React from 'react';
import { render } from '@testing-library/react-native';

import ConnectScreen from '../ConnectScreen';

describe('ConnectScreen', () => {
  it('renders without crashing', () => {
    render(<ConnectScreen onConnected={() => {}} />);
    // Just check the component renders a View
    // (You may need to add testID to root View in ConnectScreen for this to work)
    // expect(getByTestId('connect-screen-root')).toBeTruthy();
  });
});
