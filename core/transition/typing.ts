export interface Transition {
  status: TransitionStatus;
}

export const enum TransitionStatus {
  PENDING = "PENDING",
  DONE = "DONE"
}

export const enum TransitionActionType {
  PENDING = "PENDING",
  DONE = "DONE"
}

export type TransitionAction =
  | {
      type: TransitionActionType.PENDING;
    }
  | {
      type: TransitionActionType.DONE;
    };
