export type AITool =
  | 'explainFile'
  | 'suggestRefactor'
  | 'createScreen'
  | 'mapParity'
  | 'writeTest';

export type AIRequest = {
  tool: AITool;
  repoId: string;
  filePath?: string;
  selection?: { from: number; to: number };
  prompt?: string;
};
