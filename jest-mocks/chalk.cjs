// Jest mock for chalk (ESM/CJS safe)
const chalk = new Proxy({}, {
  get: () => (s) => s,
});
chalk.default = chalk;
module.exports = chalk;
