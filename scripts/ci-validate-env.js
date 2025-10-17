// Simple CI environment validator
const required = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_API_URL'];

const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
} else {
  console.log('All required environment variables present.');
}
