// Mobile App Configuration

export const config = {
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3030',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
  webUrl: process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000',
  env: process.env.EXPO_PUBLIC_ENV || 'development',
  isDev: process.env.EXPO_PUBLIC_ENV === 'development',
  isProd: process.env.EXPO_PUBLIC_ENV === 'production',
};
