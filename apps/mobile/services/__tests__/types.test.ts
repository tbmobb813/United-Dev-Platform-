import * as types from '../types';

describe('types', () => {
  it('should export all expected types', () => {
    expect(types.Project).toBeDefined();
    expect(types.ProjectFile).toBeDefined();
    expect(types.FileActivity).toBeDefined();
    expect(types.ApiResponse).toBeDefined();
  });
});
