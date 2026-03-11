import React from 'react';
import { render } from '@testing-library/react-native';
import * as UI from '../index';
import { Text } from 'react-native';

describe('UI Native smoke test', () => {
  it('should run basic test', () => {
    expect(true).toBe(true);
  });

  it('should minimally render all exports from index.js', () => {
    render(<UI.Button title="btn" onPress={() => {}} />);
    render(<UI.Input value="" onChangeText={() => {}} />);
    render(<UI.Card><Text>card</Text></UI.Card>);
    render(<UI.Loading />);
    render(<UI.Stack><Text>stack</Text></UI.Stack>);
    render(<UI.Container><Text>container</Text></UI.Container>);
  });
});
