import type { Reducer, UnknownAction } from "redux";

export type PayloadAction<P = void> = {
  type: string;
  payload: P;
};

export const createAction =
  <P = void>(type: string) =>
  (payload: P): PayloadAction<P> => ({ type, payload });

type Handler<S, P> = (state: S, action: PayloadAction<P>) => S;

/**
 * `PayloadMap` maps each handled action type to its payload type,
 * e.g. `{ [LOGIN]: AuthState; [LOGOUT]: void }`.
 */
export const createReducer = <S, PayloadMap>(
  initialState: S,
  handlers: { [K in keyof PayloadMap]: Handler<S, PayloadMap[K]> }
): Reducer<S, UnknownAction, S> => {
  const lookup = handlers as Record<string, Handler<S, unknown> | undefined>;
  return (state = initialState, action) => {
    const handler = lookup[action.type];
    return handler ? handler(state, action as PayloadAction<unknown>) : state;
  };
};
