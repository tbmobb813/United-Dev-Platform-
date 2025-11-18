export default function FastifyMock() {
  return {
    register: () => {},
    listen: async () => {},
    ready: async () => {},
    server: { close: () => {} },
  };
}
