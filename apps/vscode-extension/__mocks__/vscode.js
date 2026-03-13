module.exports = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!(prop in target)) {
        target[prop] = jest.fn();
      }
      return target[prop];
    },
  }
);
