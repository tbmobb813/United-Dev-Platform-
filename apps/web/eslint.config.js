import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
    {
        ignores: ['.next/**', 'node_modules/**', 'dist/**'],
    },
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript'
    ),
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
];

export default config;