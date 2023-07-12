import { userReducer, UserState } from "./userSlice/userReducer";
import { pmsReducer, PmsState } from "./pmsSlice/pmsReducer";

export type Action = {
  type: string;
  payload?: any;
};

type AppStore = {
  getState: () => RootState;
  subscribe: (subscriberFunc: SubscriptionFunc) => () => void;
  dispatch: <T extends Action>(action: T) => void;
};

type SubscriptionFunc = () => void;

export type RootState = {
  user: UserState;
  pms: PmsState;
};

export const emptyAction = {
  type: "@@proppu/emptyAction" as const,
};

const stateSliceToReducer = {
  user: userReducer,
  pms: pmsReducer,
};

const dummyRootState: { [K in keyof typeof stateSliceToReducer]: null } =
  Object.keys(stateSliceToReducer).reduce((acc, current) => {
    acc[current] = null;
    return acc;
  }, {} as any);

Object.freeze(dummyRootState);

const createStore = (): AppStore => {
  const stateSubcribers: Set<SubscriptionFunc> = new Set();

  let state: RootState = Object.entries(stateSliceToReducer).reduce(
    (rootStateAcc, [sliceName, sliceReducer]) => {
      (rootStateAcc as any)[sliceName] = sliceReducer(undefined, emptyAction);
      return rootStateAcc;
    },
    {} as RootState
  );

  const subscribe = (subscriberFunc: SubscriptionFunc): (() => void) => {
    stateSubcribers.add(subscriberFunc);
    return () => void stateSubcribers.delete(subscriberFunc);
  };

  const dispatch = <T extends Action>(action: T): void => {
    const stateSlices = Object.keys(stateSliceToReducer);
    let newState: RootState | null = null;

    stateSlices.forEach((sliceName) => {
      const currentSliceState = (state as any)[sliceName];
      const updatedSliceState = (stateSliceToReducer as any)[sliceName](
        currentSliceState,
        action
      );

      // do shallow equality check:
      if (currentSliceState !== updatedSliceState) {
        if (newState === null) {
          newState = { ...dummyRootState } as any;
          (newState as any)[sliceName] = updatedSliceState;
        }
      } else if (newState !== null) {
        (newState as any)[sliceName] = currentSliceState;
      }
    });

    if (newState !== null) {
      state = newState;
      stateSubcribers.forEach((subscriberFunc) => subscriberFunc());
    }
  };

  return {
    getState: () => state,
    subscribe,
    dispatch,
  };
};

export const store = createStore();
