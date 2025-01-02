export interface History {
  index: number;
  records: {
    type: HistoryActionType;
    path: string;
    params: Record<string, string>;
    animate?: boolean;
  }[];
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
    }
  | {
      type: HistoryActionType.STACK_PUSH;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: HistoryActionType.REPLACE;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | { type: HistoryActionType.BACK };
