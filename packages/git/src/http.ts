/**
 * Simple HTTP client utilities for isomorphic-git
 * Uses isomorphic-git's built-in HTTP clients for Node.js and browser compatibility
 */

interface GitHttpClient {
  request: (options: unknown) => Promise<unknown>;
}

let httpClient: GitHttpClient | undefined;

export function getHttpClient(): GitHttpClient {
  if (!httpClient) {
    if (typeof window !== 'undefined') {
      // Browser environment - use web HTTP client
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      httpClient = require('isomorphic-git/http/web') as GitHttpClient;
    } else {
      // Node.js environment - use Node HTTP client
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      httpClient = require('isomorphic-git/http/node') as GitHttpClient;
    }
  }
  return httpClient;
}

// Export default for convenience
export default getHttpClient;
