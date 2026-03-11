import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Stack, Container } from '../Layout';

describe('Stack', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Stack><Text>Child</Text></Stack>
    );
    expect(getByText('Child')).toBeTruthy();
  });

  it('applies direction, align, justify, and gap', () => {
    const { getByTestId } = render(
      <Stack direction="row" align="center" justify="space-between" gap="large" style={{ backgroundColor: 'red' }}>
        <Text>Item</Text>
      </Stack>
    );
    expect(getByTestId('StackView').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24 }),
        expect.objectContaining({ backgroundColor: 'red' })
      ])
    );
  });
});

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Container><Text>ContainerChild</Text></Container>
    );
    expect(getByText('ContainerChild')).toBeTruthy();
  });

  it('applies maxWidth and padding', () => {
    const { getByTestId } = render(
      <Container maxWidth={300} padding="large" style={{ backgroundColor: 'blue' }}>
        <Text>MaxWidth</Text>
      </Container>
    );
    expect(getByTestId('ContainerView').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ maxWidth: 300 }),
        expect.objectContaining({ backgroundColor: 'blue' })
      ])
    );
  });
});
