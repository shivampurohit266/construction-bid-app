import { UserState } from "./userReducer";

export const initializeUserData = (userData: UserState) => ({
  type: "@@proppu/user/initializeUserData" as const,
  payload: userData,
});
