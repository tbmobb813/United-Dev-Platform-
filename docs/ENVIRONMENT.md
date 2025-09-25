# Environment setup

Copy `.env.example` to `.env` in the project root and set production-quality values before running
services or CI.

Example:

1. Copy example

```bash
cp .env.example .env
```

2. Edit `.env` and set secure values for `NEXTAUTH_SECRET`, `DATABASE_URL`, and provider keys.

3. Do not commit `.env`—it's included in `.gitignore`.

Docker Compose will pick up variables from `.env` automatically. For CI, set equivalent secrets in
your pipeline provider.
