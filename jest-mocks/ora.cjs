function createSpinner() {
  return {
    start() {
      return this;
    },
    succeed() {
      return this;
    },
    fail() {
      return this;
    },
    warn() {
      return this;
    },
    set text(_) {},
    get text() {
      return '';
    },
  };
}

function ora() {
  return createSpinner();
}

module.exports = ora;
module.exports.default = ora;
