export interface Navigation {
  status: NavigationStatus;
  events: NavigationEvent[];
}

export interface NavigationEvent {
  status: NavigationStatus;
  path: string;
  params: Record<string, string>;
  recordedAt: number;
  animate?: boolean;
}

export const enum NavigationStatus {
  READY = "READY",
  PUSH = "PUSH",
  STACK_PUSH = "STACK_PUSH",
  REPLACE = "REPLACE",
  BACK = "BACK",
  BACK_START = "BACK_START",
  PUSH_NAVIGATING = "PUSH_NAVIGATING",
  STACK_PUSH_NAVIGATING = "STACK_PUSH_NAVIGATING",
  REPLACE_NAVIGATING = "REPLACE_NAVIGATING",
  BACK_NAVIGATING = "BACK_NAVIGATING",
  PUSH_DONE = "PUSH_DONE",
  STACK_PUSH_DONE = "STACK_PUSH_DONE",
  REPLACE_DONE = "REPLACE_DONE",
  BACK_DONE = "BACK_DONE"
}

export const enum NavigationActionType {
  READY = "READY",
  PUSH = "PUSH",
  STACK_PUSH = "STACK_PUSH",
  REPLACE = "REPLACE",
  BACK = "BACK",
  BACK_START = "BACK_START",
  PUSH_NAVIGATING = "PUSH_NAVIGATING",
  STACK_PUSH_NAVIGATING = "STACK_PUSH_NAVIGATING",
  REPLACE_NAVIGATING = "REPLACE_NAVIGATING",
  BACK_NAVIGATING = "BACK_NAVIGATING",
  PUSH_DONE = "PUSH_DONE",
  STACK_PUSH_DONE = "STACK_PUSH_DONE",
  REPLACE_DONE = "REPLACE_DONE",
  BACK_DONE = "BACK_DONE"
}

export type NavigationAction =
  | {
      type: NavigationActionType.PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: NavigationActionType.STACK_PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: NavigationActionType.REPLACE;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: NavigationActionType.BACK;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: NavigationActionType.BACK_START;
    }
  | { type: NavigationActionType.READY }
  | { type: NavigationActionType.PUSH_NAVIGATING }
  | { type: NavigationActionType.STACK_PUSH_NAVIGATING }
  | { type: NavigationActionType.REPLACE_NAVIGATING }
  | { type: NavigationActionType.BACK_NAVIGATING }
  | { type: NavigationActionType.PUSH_DONE }
  | { type: NavigationActionType.STACK_PUSH_DONE }
  | { type: NavigationActionType.REPLACE_DONE }
  | { type: NavigationActionType.BACK_DONE };
