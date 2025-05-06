import { AnimationType } from "@core/animator/typing";

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
  animationType?: AnimationType;
}

export const enum NavigationStatus {
  READY = "READY",
  PUSH = "PUSH",
  PUSH_STACK = "PUSH_STACK",
  REPLACE = "REPLACE",
  BACK = "BACK",
  PUSH_NAVIGATING = "PUSH_NAVIGATING",
  PUSH_STACK_NAVIGATING = "PUSH_STACK_NAVIGATING",
  REPLACE_NAVIGATING = "REPLACE_NAVIGATING",
  BACK_NAVIGATING = "BACK_NAVIGATING",
  PUSH_DONE = "PUSH_DONE",
  PUSH_STACK_DONE = "PUSH_STACK_DONE",
  REPLACE_DONE = "REPLACE_DONE",
  BACK_DONE = "BACK_DONE"
}

export const enum NavigationActionType {
  READY = "READY",
  PUSH = "PUSH",
  PUSH_STACK = "PUSH_STACK",
  REPLACE = "REPLACE",
  BACK = "BACK",
  PUSH_NAVIGATING = "PUSH_NAVIGATING",
  PUSH_STACK_NAVIGATING = "PUSH_STACK_NAVIGATING",
  REPLACE_NAVIGATING = "REPLACE_NAVIGATING",
  BACK_NAVIGATING = "BACK_NAVIGATING",
  PUSH_DONE = "PUSH_DONE",
  PUSH_STACK_DONE = "PUSH_STACK_DONE",
  REPLACE_DONE = "REPLACE_DONE",
  BACK_DONE = "BACK_DONE"
}

export type NavigationAction =
  | {
      type: NavigationActionType.PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: NavigationActionType.PUSH_STACK;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: NavigationActionType.REPLACE;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: NavigationActionType.BACK;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | { type: NavigationActionType.READY }
  | { type: NavigationActionType.PUSH_NAVIGATING }
  | { type: NavigationActionType.PUSH_STACK_NAVIGATING }
  | { type: NavigationActionType.REPLACE_NAVIGATING }
  | { type: NavigationActionType.BACK_NAVIGATING }
  | { type: NavigationActionType.PUSH_DONE }
  | { type: NavigationActionType.PUSH_STACK_DONE }
  | { type: NavigationActionType.REPLACE_DONE }
  | { type: NavigationActionType.BACK_DONE };
