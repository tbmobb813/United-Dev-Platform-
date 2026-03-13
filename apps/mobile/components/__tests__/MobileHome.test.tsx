import React from 'react';
import { render } from '@testing-library/react-native';
import MobileHome from '../MobileHome';

describe('MobileHome', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MobileHome />);
    expect(toJSON()).toBeTruthy();
  });

  it('does not crash when isConnected is true but pairingData is null (Edit tab regression)', () => {
    const mockProps = {
      // Regression scenario: connection established but pairing data not yet populated.
      isConnected: true,
      pairingData: null,
    } as any;

    const { toJSON } = render(<MobileHome {...mockProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
