const fetch = (...args) => {
  if (typeof global.fetch === 'function') {
    return global.fetch(...args);
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  });
};

module.exports = fetch;
module.exports.default = fetch;
module.exports.__esModule = true;
