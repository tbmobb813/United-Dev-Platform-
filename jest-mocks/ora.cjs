// Jest mock for ora (ESM/CJS safe)
const ora = () => ({
  start: () => ora(),
  succeed: () => ora(),
  fail: () => ora(),
  warn: () => ora(),
  get text() { return ''; },
  set text(_) {},
});
ora.default = ora;
module.exports = ora;
