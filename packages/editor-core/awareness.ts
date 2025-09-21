import type { Awareness } from "y-protocols/awareness";

export type UserState = {
  id: string;
  name: string;
  color: string;
};

type AwarenessState = { user: UserState };

export function listUsers(awareness: Awareness): UserState[] {
  const states = Array.from(awareness.getStates().values()) as AwarenessState[];
  return states.map((s) => s.user);
}
