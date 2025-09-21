import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

export type UserState = {
  id: string;
  name: string;
  color: string;
};

// Create a Y.Doc instance for collaboration
export const ydoc = new Y.Doc();

// Create awareness instance
export const awareness = new Awareness(ydoc);

// Helper function to set user state
export function setUserState(userState: UserState) {
  awareness.setLocalState(userState);
}

// Helper function to get all user states
export function getAllUserStates(): Map<number, UserState> {
  return awareness.getStates() as Map<number, UserState>;
}
