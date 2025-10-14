import React, { useEffect, useState } from 'react';
// Import logger dynamically to avoid module resolution issues in some environments
// but keep type safety via declaration file in packages/logger
import logger from '@udp/logger';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Stack } from './Layout';
import { Loading } from './Loading';
import { Modal } from './Modal';

export interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  aiModel: 'gpt-4o-mini' | 'gpt-4' | 'claude' | 'local';
  openaiApiKey: string;
  allowLocalModels: boolean;
  localModelUrl: string;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  autoSave: true,
  aiModel: 'gpt-4o-mini',
  openaiApiKey: '',
  allowLocalModels: false,
  localModelUrl: 'http://localhost:11434/v1',
};

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedSettings = localStorage.getItem('udp-settings');
      if (savedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        } catch (error) {
          logger.error('Failed to parse settings from localStorage', error);
        }
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('udp-settings', JSON.stringify(settings));
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      logger.error('Failed to save settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    logger.warn('Settings reset to defaults.');
    setSettings(defaultSettings);
    localStorage.removeItem('udp-settings');
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Settings'
      size='large'
      actions={[
        <Button key='reset' variant='outline' onClick={handleReset}>
          Reset to Defaults
        </Button>,
        <Button key='cancel' variant='secondary' onClick={onClose}>
          Cancel
        </Button>,
        <Button key='save' onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loading /> : isSaved ? '✓ Saved!' : 'Save Settings'}
        </Button>,
      ]}
    >
      <Stack gap='large'>
        {/* Editor Settings */}
        <Card title='Editor' padding='medium'>
          <Stack gap='medium'>
            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Theme:</label>
              <select
                value={settings.theme}
                onChange={e =>
                  updateSetting('theme', e.target.value as AppSettings['theme'])
                }
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              >
                <option value='light'>Light</option>
                <option value='dark'>Dark</option>
                <option value='auto'>Auto</option>
              </select>
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Font Size:</label>
              <Input
                value={settings.fontSize.toString()}
                onChange={value =>
                  updateSetting('fontSize', parseInt(value) || 14)
                }
                style={{ width: '80px' }}
              />
              <span style={{ color: '#666' }}>px</span>
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Tab Size:</label>
              <Input
                value={settings.tabSize.toString()}
                onChange={value =>
                  updateSetting('tabSize', parseInt(value) || 2)
                }
                style={{ width: '80px' }}
              />
              <span style={{ color: '#666' }}>spaces</span>
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Word Wrap:</label>
              <input
                type='checkbox'
                checked={settings.wordWrap}
                onChange={e => updateSetting('wordWrap', e.target.checked)}
              />
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Show Minimap:</label>
              <input
                type='checkbox'
                checked={settings.minimap}
                onChange={e => updateSetting('minimap', e.target.checked)}
              />
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Auto Save:</label>
              <input
                type='checkbox'
                checked={settings.autoSave}
                onChange={e => updateSetting('autoSave', e.target.checked)}
              />
            </Stack>
          </Stack>
        </Card>

        {/* AI Settings */}
        <Card title='AI Assistant' padding='medium'>
          <Stack gap='medium'>
            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>AI Model:</label>
              <select
                value={settings.aiModel}
                onChange={e =>
                  updateSetting(
                    'aiModel',
                    e.target.value as AppSettings['aiModel']
                  )
                }
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minWidth: '150px',
                }}
              >
                <option value='gpt-4o-mini'>GPT-4o Mini</option>
                <option value='gpt-4'>GPT-4</option>
                <option value='claude'>Claude</option>
                <option value='local'>Local Model</option>
              </select>
            </Stack>

            <Stack gap='small'>
              <label>OpenAI API Key:</label>
              <Input
                value={settings.openaiApiKey}
                onChange={value => updateSetting('openaiApiKey', value)}
                placeholder='sk-...'
                type='password'
              />
              <div style={{ fontSize: '12px', color: '#666' }}>
                Your API key is stored locally and never sent to our servers
              </div>
            </Stack>

            <Stack direction='row' gap='medium' align='center'>
              <label style={{ minWidth: '120px' }}>Enable Local Models:</label>
              <input
                type='checkbox'
                checked={settings.allowLocalModels}
                onChange={e =>
                  updateSetting('allowLocalModels', e.target.checked)
                }
              />
            </Stack>

            {settings.allowLocalModels && (
              <Stack gap='small'>
                <label>Local Model URL:</label>
                <Input
                  value={settings.localModelUrl}
                  onChange={value => updateSetting('localModelUrl', value)}
                  placeholder='http://localhost:11434/v1'
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                  URL for your local AI model server (e.g., Ollama)
                </div>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Info */}
        <Card title='About' padding='medium'>
          <Stack gap='small'>
            <div>
              <strong>Unified Dev Platform</strong> v0.0.2
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              A collaborative development environment with AI assistance
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              💡 Settings are automatically saved locally and will persist
              between sessions
            </div>
          </Stack>
        </Card>
      </Stack>
    </Modal>
  );
};
