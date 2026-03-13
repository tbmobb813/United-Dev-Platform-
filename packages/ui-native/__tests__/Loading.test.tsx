import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('renders with default props', () => {
    const { getByText, getByTestId } = render(<Loading />);
    expect(getByText('Loading...')).toBeTruthy();
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('renders with custom text', () => {
    const { getByText } = render(<Loading text='Please wait' />);
    expect(getByText('Please wait')).toBeTruthy();
  });

  it('does not render text if text is empty', () => {
    const { queryByText } = render(<Loading text='' />);
    expect(queryByText('Loading...')).toBeNull();
  });

  it('renders with custom size and color', () => {
    const { getByTestId } = render(<Loading size='large' color='#123456' />);
    const indicator = getByTestId('ActivityIndicator');
    expect(indicator.props.size).toBe('large');
    expect(indicator.props.color).toBe('#123456');
  });
});
