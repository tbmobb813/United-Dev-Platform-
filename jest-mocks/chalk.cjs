// Jest mock for chalk (ESM/CJS safe)
const passthrough = (value) => value;
const bold = Object.assign(passthrough, {
  blue: passthrough,
  cyan: passthrough,
});

const chalk = {
  green: passthrough,
  red: passthrough,
  yellow: passthrough,
  cyan: passthrough,
  dim: passthrough,
  bold,
};

module.exports = chalk;
module.exports.default = chalk;
module.exports.__esModule = true;
