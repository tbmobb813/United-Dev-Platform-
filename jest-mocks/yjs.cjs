class Text {
  constructor(value = '') {
    this.value = value;
  }

  observe() {}

  toString() {
    return this.value;
  }
}

class Doc {
  getText() {
    return new Text('');
  }
}

module.exports = {
  __esModule: true,
  Doc,
  Text,
};
