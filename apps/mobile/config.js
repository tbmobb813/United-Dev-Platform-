// Mobile App Configuration

export const DEFAULT_SERVER_IP = 'localhost';
export const DEFAULT_SERVER_PORT = 3030;

export function buildConfig(
  serverIp = DEFAULT_SERVER_IP,
  port = DEFAULT_SERVER_PORT
) {
  return {
    wsUrl: `ws://${serverIp}:${port}`,
    apiUrl: `http://${serverIp}:${port}`,
  };
}

// Backward-compatible default export
export const config = buildConfig();
