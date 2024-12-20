# 🐺 Husky Commit Hooks

This directory contains all the git commit hooks used in the application. The hooks are managed by [Husky](https://typicode.github.io/husky/#/). There are many different types of commit hooks available, notably:

- [`commit-msg`](#commit-msg): Used to validate the commit message
- [`pre-commit`](#pre-commit): Used to run scripts before a commit is made
- `pre-push`: Used to run scripts before a push is made



## 💻 Getting Started

To set up Husky git commit hooks, run the following commands:

```bash
# Install node modules (including husky)
npm install

# Enable Git hook
npx husky install

# Set permissions for husky hooks
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```



## [`commit-msg`](https://github.com/Economics-NPRP/ets-frontend/blob/dev/src/.husky/commit-msg)

This hook is used to validate the commit message. To do so, it runs the `commitlint` script located in [`package.json`](https://github.com/Economics-NPRP/ets-frontend/blob/dev/src/package.json) which lints using the configuration in [`commitlint.config.js`](https://github.com/Economics-NPRP/ets-frontend/blob/dev/src/commitlint.config.js). The commit linting process is based on the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Usage

```bash
# Failing Commit Message
git commit -m "made some changes lol"

# Passing Commit Message
git commit -m "feat: add a new feature"
```

---

## [`pre-commit`](https://github.com/Economics-NPRP/ets-frontend/blob/dev/src/.husky/pre-commit)

Currently, this commit hook only runs one process. It lints the staged changes and makes sure they follow the specifications set in [`.eslintrc.js`](https://github.com/Economics-NPRP/ets-frontend/blob/dev/src/.eslintrc.js). If the linting fails, the commit will be aborted.
