export interface Navigation {
  status: NavigationStatus;
  events: { status: NavigationStatus; path: string }[];
}

export const enum NavigationStatus {
  READY = "READY",
  PUSH = "PUSH",
  REPLACE = "REPLACE",
  POP = "POP",
  DONE = "DONE"
}

export const enum NavigationActionType {
  SET = "SET_NAVIGATION",
  PUSH = "PUSH_NAVIGATION",
  POP = "POP_NAVIGATION",
  READY = "READY_NAVIGATION",
  DONE = "DONE_NAVIGATION"
}

export type NavigationAction =
  | { type: NavigationActionType.SET; navigation: Navigation }
  | { type: NavigationActionType.PUSH; path: string }
  | { type: NavigationActionType.POP; path: string }
  | { type: NavigationActionType.READY }
  | { type: NavigationActionType.DONE };
