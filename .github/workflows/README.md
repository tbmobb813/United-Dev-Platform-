# Workflow pnpm setup

This repository's workflows use Corepack to enable and activate pnpm on
GitHub-hosted runners.

## Why Corepack?

- Corepack (shipped with Node >= 16.10) provides a stable, fast way to
  enable/manage package managers like pnpm and yarn without installing them
  globally.
- It avoids global npm installs and reduces chance of PATH/race issues.

## Pattern used in workflows

After `actions/setup-node@v4` we run:

```sh
corepack enable
corepack prepare pnpm@<version> --activate
```

The workflows rely on Corepack to provide the `pnpm` executable for subsequent
steps (install/build/lint/test).

## Notes

- If you use self-hosted runners that don't include Corepack or run Node <
  16.10, install pnpm manually or ensure Corepack is installed on the runner.
- We intentionally removed `pnpm/action-setup` and `npm install -g pnpm` steps
  to keep workflows simpler. If you need strict pinning of pnpm beyond what
  Corepack provides, re-add `pnpm/action-setup`.

If you'd like this documentation expanded (examples, troubleshooting, or a short
CI job to validate pnpm availability), say so and I'll add it.
