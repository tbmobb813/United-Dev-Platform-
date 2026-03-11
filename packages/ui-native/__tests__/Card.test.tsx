import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../Card';

import { Text } from 'react-native';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card><Text>Content</Text></Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders with title', () => {
    const { getByText } = render(
      <Card title="My Title"><Text>Content</Text></Card>
    );
    expect(getByText('My Title')).toBeTruthy();
    expect(getByText('Content')).toBeTruthy();
  });

  it('applies padding variants', () => {
    const { getByText, rerender } = render(
      <Card padding="small"><Text>Small</Text></Card>
    );
    expect(getByText('Small')).toBeTruthy();
    rerender(<Card padding="large"><Text>Large</Text></Card>);
    expect(getByText('Large')).toBeTruthy();
  });

  it('renders without shadow', () => {
    const { getByText } = render(
      <Card shadow={false}><Text>No Shadow</Text></Card>
    );
    expect(getByText('No Shadow')).toBeTruthy();
  });
});
