import { Awareness } from "y-protocols/awareness";

export type UserState = {
  id: string;
  name: string;
  color: string;
};

// Helper function to set user state
export function setUserState(awareness: Awareness, userState: UserState) {
  awareness.setLocalState(userState);
}

// Helper function to get all user states
export function getAllUserStates(awareness: Awareness): Map<number, UserState> {
  return awareness.getStates() as Map<number, UserState>;
}
