import type { Awareness } from 'y-protocols/awareness';

export type UserState = {
  id: string;
  name: string;
  color: string;
};

export function listUsers(awareness: Awareness): UserState[] {
  const states = Array.from(awareness.getStates().values()) as any[];
  return states.map((s) => s.user);
}