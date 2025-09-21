export type AITool =
  | "explainFile"
  | "suggestRefactor"
  | "createScreen"
  | "mapParity"
  | "writeTest";

export type AIRequest = {
  tool: AITool;
  repoId: string;
  filePath?: string;
  selection?: { from: number; to: number };
  prompt?: string;
};

export const prompts = {
  explainFile: `You are a senior engineer. Explain the file succinctly...`,
  suggestRefactor: `Propose a safe refactor with a unified diff...`,
};
