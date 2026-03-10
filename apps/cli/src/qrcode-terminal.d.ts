declare module 'qrcode-terminal' {
  function generate(text: string, opts?: { small?: boolean }, callback?: (qrcode: string) => void): void;
  function setErrorLevel(level: 'L' | 'M' | 'Q' | 'H'): void;
  export { generate, setErrorLevel };
  export default { generate, setErrorLevel };
}
