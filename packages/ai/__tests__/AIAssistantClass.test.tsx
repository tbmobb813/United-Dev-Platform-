import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { AIAssistantClass } from '../AIAssistantClass';

describe('AIAssistantClass', () => {
  it('renders without crashing', () => {
    const { container } = render(<AIAssistantClass apiKey="test" />);
    expect(container).toBeTruthy();
  });
});
