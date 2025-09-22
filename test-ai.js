// Quick test of AI integration
const { AIManager } = require('./packages/ai/AIManager.ts');

async function testAI() {
  try {
    const aiManager = new AIManager({
      defaultProvider: 'openai',
      apiKeys: {},
      enableStreaming: true,
    });

    console.log('AI Manager created successfully');
    console.log('Is ready:', aiManager.isReady());

    const response = await aiManager.chat('Hello, can you help me?', {
      fileName: 'test.js',
      language: 'javascript',
    });

    console.log('AI Response:', response.content);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAI();
