import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const Input = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  style,
  disabled = false,
}) => {
  return (
    <TextInput
      style={[styles.input, multiline && styles.multiline, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      numberOfLines={numberOfLines}
      editable={!disabled}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor='#999'
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: 'white',
  },
  multiline: {
    paddingVertical: 12,
    minHeight: 80,
  },
});
