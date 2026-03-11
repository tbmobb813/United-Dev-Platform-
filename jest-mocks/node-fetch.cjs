// CJS mock for node-fetch — used in Jest tests to avoid ESM parse errors
// Tests that import node-fetch will get this stub; jest.mock('node-fetch')
// will then replace it with a jest.fn() mock as needed.
const fetch = jest.fn();
fetch.default = fetch;

module.exports = fetch;
module.exports.default = fetch;
