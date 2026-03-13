/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import AIAssistantSimple from '../AIAssistantSimple';

describe('AIAssistantSimple', () => {
  it('renders without crashing', () => {
    const { container } = render(<AIAssistantSimple apiKey='test' />);
    expect(container).toBeTruthy();
  });
});
