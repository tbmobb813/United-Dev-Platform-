# Contributing to United Dev Platform

Thank you for your interest in contributing to United Dev Platform! This document provides
guidelines and information for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating,
you are expected to uphold this code. Please report unacceptable behavior to
conduct@udp.example.com.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless
of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level
of experience, education, socio-economic status, nationality, personal appearance, race, religion,
or sexual identity and orientation.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (latest version)
- Git
- Docker and Docker Compose (for full development environment)
- VS Code (recommended)

### Development Setup

1. **Fork and Clone**

```bash
git clone https://github.com/your-username/United-Dev-Platform-.git
cd United-Dev-Platform-
```

2. **Install Dependencies**

```bash
corepack enable
pnpm install
```

3. **Environment Setup**

```bash
cp .env.example .env.development
# Edit .env.development with your configuration
```

4. **Validate Setup**

```bash
pnpm validate-env
pnpm type-check
pnpm lint
```

5. **Start Development**

```bash
pnpm dev
```

## Contributing Process

### 1. Find or Create an Issue

- Check existing issues before creating a new one
- Use issue templates for bug reports and feature requests
- Discuss significant changes in an issue before starting work

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Follow our coding standards
- Write tests for new functionality
- Update documentation as needed
- Ensure all checks pass locally

### 4. Test Your Changes

```bash
pnpm check          # Run all checks
pnpm test           # Run tests
pnpm validate-env   # Validate environment
```

### 5. Submit a Pull Request

- Use our PR template
- Include tests and documentation
- Reference related issues
- Request review from maintainers

## Coding Standards

### General Principles

- **Clarity**: Write code that is easy to read and understand
- **Consistency**: Follow existing patterns and conventions
- **Simplicity**: Prefer simple solutions over complex ones
- **Performance**: Consider performance implications
- **Security**: Follow security best practices

### Code Style

We use ESLint and Prettier for code formatting:

```bash
pnpm lint           # Check for issues
pnpm lint:fix       # Fix automatically
pnpm format         # Format with Prettier
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide explicit types for function parameters and return values
- Use interfaces for object shapes
- Prefer `type` for unions and primitives
- Avoid `any` type unless absolutely necessary

### React Guidelines

- Use functional components with hooks
- Follow React best practices for performance
- Use meaningful component and prop names
- Write components that are easy to test

### API Guidelines

- Use RESTful conventions
- Provide clear error messages
- Validate all inputs
- Use proper HTTP status codes
- Document all endpoints

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
feat(auth): add OAuth2 authentication
fix(api): resolve memory leak in WebSocket connections
docs(setup): update development environment guide
test(user): add unit tests for user service
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass locally
- [ ] Code follows our style guidelines
- [ ] Self-review of the code completed
- [ ] Documentation updated if needed
- [ ] No merge conflicts

### PR Requirements

1. **Description**: Provide a clear description of changes
2. **Testing**: Include evidence that your changes work
3. **Documentation**: Update docs for any new features
4. **Breaking Changes**: Clearly identify any breaking changes

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Changes must include appropriate tests
4. **Documentation**: Documentation must be updated

## Issue Guidelines

### Bug Reports

Use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Screenshots if applicable

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use cases and business value
- Implementation considerations
- Success criteria

### Questions and Discussions

For questions:

- Check existing documentation first
- Search previous issues and discussions
- Use GitHub Discussions for broader questions
- Be specific about what you're trying to achieve

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Testing

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Monitor application performance

### Documentation

- Keep README up to date
- Document all public APIs
- Provide examples for complex features
- Update changelog for releases

## Resources

### Documentation

- [README](README.md) - Project overview
- [DevOps Setup](docs/devops-setup.md) - Development environment
- [API Documentation](docs/api.md) - API reference
- [Security Policy](SECURITY.md) - Security guidelines

### Tools

- [VS Code Extensions](.vscode/extensions.json) - Recommended extensions
- [ESLint Configuration](packages/eslint-config) - Code linting
- [Prettier Configuration](packages/prettier-config) - Code formatting

### Community

- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and community discussion
- Email - security@udp.example.com (security issues only)

## Recognition

Contributors will be recognized in our:

- README contributors section
- Release notes
- Annual contributor recognition

Thank you for contributing to United Dev Platform! 🚀
