// Lightweight shared logger exported for workspace-wide use.
const isProd = process.env.NODE_ENV === 'production';

function format(...args: any[]) {
  return args
    .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ');
}

const logger = {
  info: (...args: any[]) => {
    if (!isProd) {
      console.log('[info]', format(...args));
    }
  },
  warn: (...args: any[]) => {
    console.warn('[warn]', format(...args));
  },
  error: (...args: any[]) => {
    console.error('[error]', format(...args));
  },
};

export default logger;
