#!/usr/bin/env node

/**
 * DevOps Foundation Validation Script
 * Validates that all DevOps components are properly configured
 */

/* eslint-disable no-console */

import { existsSync, readFileSync } from 'fs';

const checks = [
  {
    name: 'Repository Clean (.gitignore)',
    check: () => existsSync('.gitignore'),
    details: 'Ensure .gitignore exists and excludes sensitive files',
  },
  {
    name: 'ESLint Configuration',
    check: () => existsSync('packages/eslint-config/package.json'),
    details: 'Shared ESLint configuration package',
  },
  {
    name: 'Prettier Configuration',
    check: () => existsSync('packages/prettier-config/package.json'),
    details: 'Shared Prettier configuration package',
  },
  {
    name: 'Environment Validation Script',
    check: () => existsSync('scripts/validate-env.js'),
    details: 'Environment variable validation utility',
  },
  {
    name: 'VS Code Workspace',
    check: () =>
      existsSync('.vscode/settings.json') &&
      existsSync('.vscode/extensions.json'),
    details: 'VS Code configuration for consistent development',
  },
  {
    name: 'Docker Configuration',
    check: () => existsSync('Dockerfile') && existsSync('docker-compose.yml'),
    details: 'Containerization for development and production',
  },
  {
    name: 'CI/CD Pipeline',
    check: () => existsSync('.github/workflows/ci-cd.yml'),
    details: 'GitHub Actions workflow for automation',
  },
  {
    name: 'DevOps Documentation',
    check: () => existsSync('docs/devops-setup.md'),
    details: 'Comprehensive setup and maintenance guide',
  },
  {
    name: 'Contributing Guidelines',
    check: () => existsSync('CONTRIBUTING.md'),
    details: 'Contribution guidelines and development process',
  },
  {
    name: 'Security Policy',
    check: () => existsSync('SECURITY.md'),
    details: 'Security vulnerability reporting process',
  },
  {
    name: 'Package Scripts',
    check: () => {
      try {
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        return pkg.scripts && pkg.scripts['validate-env'];
      } catch {
        return false;
      }
    },
    details: 'Environment validation script in package.json',
  },
];

function validateDevOpsFoundation() {
  console.log('🔍 Validating DevOps Foundation Setup...\n');

  const results = checks.map(({ name, check, details }) => {
    const passed = check();
    console.log(`${passed ? '✅' : '❌'} ${name}`);
    if (!passed) {
      console.log(`   📝 ${details}`);
    }
    return { name, passed, details };
  });

  const passedChecks = results.filter(r => r.passed).length;
  const totalChecks = results.length;

  console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed`);

  if (passedChecks === totalChecks) {
    console.log('\n🎉 DevOps Foundation is fully configured!');
    console.log('\n📋 What you can do now:');
    console.log('   🚀 Start development: pnpm dev');
    console.log('   🔧 Run validation: pnpm validate-env');
    console.log('   🏗️  Build project: pnpm build');
    console.log('   🐳 Start Docker: docker-compose up');
    console.log('   📖 Read docs: docs/devops-setup.md');
  } else {
    console.log('\n⚠️  Some components are missing or incomplete:');
    results
      .filter(r => !r.passed)
      .forEach(({ name, details }) => {
        console.log(`   ❌ ${name}: ${details}`);
      });
    console.log(
      '\n📖 Refer to docs/devops-setup.md for complete setup instructions'
    );
  }

  console.log('\n🔗 Next Steps:');
  console.log('   1. Install dependencies: pnpm install');
  console.log('   2. Configure environment: cp .env.example .env.development');
  console.log('   3. Start development: pnpm dev');
  console.log('   4. Set up CI/CD secrets in GitHub repository settings');
  console.log('   5. Review security policy and contributing guidelines');
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDevOpsFoundation();
}

export { validateDevOpsFoundation };
