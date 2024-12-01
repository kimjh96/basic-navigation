export interface History {
  records: { path: string; params: Record<string, string> }[];
}

export const enum HistoryActionType {
  SET = "SET",
  PUSH = "PUSH",
  POP = "POP"
}

export type HistoryAction =
  | { type: HistoryActionType.SET; state: History }
  | { type: HistoryActionType.PUSH; path: string; params: Record<string, string> }
  | { type: HistoryActionType.POP };
