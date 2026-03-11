const Y = {
  Text: class MockText {
    constructor(value = '') {
      this.value = value;
    }

    toString() {
      return this.value;
    }

    observe() {}
  },
};

class DocumentManager {
  constructor() {}

  async openDocument() {
    return { content: new Y.Text('') };
  }

  onCollaboratorsChanged() {}

  destroy() {}
}

module.exports = {
  DocumentManager,
  UserPresence: function UserPresence() {},
  Y,
};
