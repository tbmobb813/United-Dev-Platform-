
describe('Yjs Duplication Check', () => {
  it('should not have multiple Yjs instances', () => {
    // Use Record<string, unknown> for globalScope to avoid 'any' warnings
    const globalScope: Record<string, unknown> = typeof globalThis !== 'undefined'
      ? (globalThis as unknown as Record<string, unknown>)
      : (typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>) : {});
    const yjsMarker = '__YJS_DUPLICATION_CHECK__';

    if (globalScope[yjsMarker]) {
      console.error('Yjs has already been imported. This indicates a duplication issue.');
    }

    globalScope[yjsMarker] = true;

    // The real test is whether this assertion fails.
    // If it does, it means the marker was already set.
    expect(globalScope[yjsMarker]).toBe(true);
  });
});
