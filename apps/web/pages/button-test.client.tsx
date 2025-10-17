/* eslint-env browser */
import { Button } from '@udp/ui';

export default function ButtonTestClient() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Button Test</h1>
      <p>Testing the Button component in isolation:</p>

      <div style={{ marginBottom: 10 }}>
        <Button onClick={handleClick}>Test Button 1</Button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <Button onClick={handleClick}>Test Button 2</Button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <Button onClick={() => window.alert('Hello!')}>Alert Button</Button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <Button>Button without onClick</Button>
      </div>
    </div>
  );
}
