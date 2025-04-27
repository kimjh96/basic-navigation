import { AnimationType } from "@core/animator/typing";

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
  PUSH_STACK = "PUSH_STACK",
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
      type: HistoryActionType.PUSH_STACK;
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
