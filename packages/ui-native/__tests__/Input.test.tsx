import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={() => {}} placeholder="Type here" />
    );
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={onChangeText} placeholder="Type here" />
    );
    fireEvent.changeText(getByPlaceholderText('Type here'), 'abc');
    expect(onChangeText).toHaveBeenCalledWith('abc');
  });

  it('is not editable when disabled', () => {
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={() => {}} placeholder="Disabled" disabled />
    );
    expect(getByPlaceholderText('Disabled').props.editable).toBe(false);
  });
});
