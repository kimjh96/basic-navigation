export interface Navigation {
  status: NavigationStatus;
  events: { status: NavigationStatus; path: string; params: Record<string, string> }[];
}

export const enum NavigationStatus {
  READY = "READY",
  PUSH = "PUSH",
  STACK_PUSH = "STACK_PUSH",
  REPLACE = "REPLACE",
  BACK = "BACK",
  NAVIGATING = "NAVIGATING",
  DONE = "DONE"
}

export const enum NavigationActionType {
  PUSH = "PUSH_NAVIGATION",
  STACK_PUSH = "STACK_PUSH_NAVIGATION",
  REPLACE = "REPLACE",
  BACK = "BACK_NAVIGATION",
  READY = "READY_NAVIGATION",
  NAVIGATING = "NAVIGATING_NAVIGATION",
  DONE = "DONE_NAVIGATION"
}

export type NavigationAction =
  | {
      type: NavigationActionType.PUSH;
      path: string;
      params: Record<string, string>;
    }
  | {
      type: NavigationActionType.STACK_PUSH;
      path: string;
      params: Record<string, string>;
    }
  | {
      type: NavigationActionType.REPLACE;
      path: string;
      params: Record<string, string>;
    }
  | {
      type: NavigationActionType.BACK;
      path: string;
      params: Record<string, string>;
    }
  | { type: NavigationActionType.READY }
  | { type: NavigationActionType.NAVIGATING }
  | { type: NavigationActionType.DONE };
