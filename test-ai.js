// Quick test of AI integration
const { AIManager } = require('./packages/ai/AIManager');

// Use the monorepo logger if available, otherwise fall back to console so this
// script remains runnable in dev environments where packages may not be built.
const logger = (() => {
  try {
    // prefer default export when available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@udp/logger');
    return mod && mod.default ? mod.default : mod;
  } catch (e) {
    return console;
  }
})();

async function testAI() {
  try {
    const aiManager = new AIManager({
      defaultProvider: 'openai',
      apiKeys: {},
      enableStreaming: true,
    });

    logger.info('AI Manager created successfully');
    logger.info('Is ready:', aiManager.isReady());

    const response = await aiManager.chat('Hello, can you help me?', {
      fileName: 'test.js',
      language: 'javascript',
    });

    logger.info('AI Response:', response.content);
  } catch {
    logger.error('Test failed: unknown error');
  }
}

testAI();
