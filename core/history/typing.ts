import { AnimationType } from "@core/animation/typing";

export interface History {
  index: number;
  records: HistoryRecord[];
}

export interface HistoryRecord {
  type: HistoryActionType;
  path: string;
  params: Record<string, string>;
  animate?: boolean;
  animationType?: AnimationType;
}

export const enum HistoryActionType {
  PUSH = "PUSH",
  STACK_PUSH = "STACK_PUSH",
  REPLACE = "REPLACE",
  BACK = "BACK"
}

export type HistoryAction =
  | {
      type: HistoryActionType.PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: HistoryActionType.STACK_PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: HistoryActionType.REPLACE;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | { type: HistoryActionType.BACK };
