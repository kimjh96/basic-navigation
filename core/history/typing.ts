export interface History {
  records: string[];
}

export const enum HistoryActionType {
  SET = "SET",
  PUSH = "PUSH",
  POP = "POP"
}

export type HistoryAction =
  | { type: HistoryActionType.SET; state: History }
  | { type: HistoryActionType.PUSH; path: string }
  | { type: HistoryActionType.POP };
