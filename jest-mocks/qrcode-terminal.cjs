// Jest mock for qrcode-terminal (ESM/CJS safe)
const qrcode = {
  generate: jest.fn(),
};
qrcode.default = qrcode;
module.exports = qrcode;
