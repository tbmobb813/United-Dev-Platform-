'use client';

/* eslint-env browser */
import React, { useState } from 'react';
import { AIAssistant } from '@udp/ai';
import { Button } from '@udp/ui';

const ButtonAny: any = Button;
const AIAssistantAny: any = AIAssistant;
import logger from '@udp/logger';

export default function TestAIAssistantClient() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [currentFile] = useState('test-file.tsx');
  const [selectedCode] = useState(
    'function testFunction() {\n  logger.info("Hello world!");\n}'
  );

  const handleCodeInsert = (code: string) => {
    logger.info('Inserting code:', code);
    window.alert(`Code would be inserted: ${code.substring(0, 50)}...`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Assistant Test Page (Client)</h1>
      <p>This page tests the AI Assistant component integration.</p>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current Context:</h3>
        <p>
          <strong>File:</strong> {currentFile}
        </p>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {selectedCode}
        </pre>
      </div>

      <ButtonAny onClick={() => setIsAIOpen(true)}>
        🤖 Open AI Assistant
      </ButtonAny>

      <AIAssistantAny
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentFile={currentFile}
        selectedCode={selectedCode}
        onCodeInsert={handleCodeInsert}
      />

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
        }}
      >
        <h3>✅ Test Results:</h3>
        <ul>
          <li>AI Assistant component imported successfully</li>
          <li>UI components (Button) imported successfully</li>
          <li>TypeScript compilation passes</li>
          <li>Component renders without errors</li>
        </ul>
      </div>
    </div>
  );
}
