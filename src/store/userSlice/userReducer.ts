import { Action } from "../appStore";

export type UserState = {
  address: string | null;
  email: string | null;
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  user_id: number | null;
  username: string | null;
};

const initialState: UserState = Object.freeze({
  address: null,
  email: null,
  id: null,
  first_name: null,
  last_name: null,
  phone: null,
  user_id: null,
  username: null,
});

export const userReducer = (
  state: UserState = initialState,
  { type: actionType, payload }: Action
): UserState => {
  if (actionType === "@@proppu/user/initializeUserData") {
    const userData = payload;
    return userData;
  } else {
    return state;
  }
};
