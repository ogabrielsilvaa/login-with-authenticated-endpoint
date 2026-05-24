import { User } from "../types/auth";

export type AuthState = {
  token: string | null;
  user: User | null;
};

export type AuthAction =
  | { type: "LOGIN"; token: string; user: User }
  | { type: "LOGOUT" };

export const initialState: AuthState = {
  token: null,
  user: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { token: action.token, user: action.user };
    case "LOGOUT":
      return { token: null, user: null };
    default:
      return state;
  }
}
