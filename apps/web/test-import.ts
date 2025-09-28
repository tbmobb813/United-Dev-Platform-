// Test file to verify imports work correctly
import { AIAssistant } from '@udp/ai';
import { Button, Card, Modal } from '@udp/ui';
import logger from '@udp/logger';

/* eslint-disable no-console */
logger.info('✅ All imports successful!');
logger.info('AIAssistant:', typeof AIAssistant);
logger.info('Button:', typeof Button);
logger.info('Card:', typeof Card);
logger.info('Modal:', typeof Modal);
