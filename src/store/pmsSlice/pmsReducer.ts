import { Action } from "../appStore";

export type PmsState = {
  pmsToken: string | null;
};

const initialPmsState: PmsState = Object.freeze({
  pmsToken: null,
});

export const pmsReducer = <T extends Action>(
  state: PmsState = initialPmsState,
  action: T
) => {
  if (action.type === "@@proppu/pms/initializeToken") {
    return {
      ...state,
      pmsToken: action.payload,
    };
  } else {
    return state;
  }
};
