export interface History {
  index: number;
  records: { path: string; params: Record<string, string> }[];
}

export const enum HistoryActionType {
  PUSH = "PUSH",
  POP = "POP"
}

export type HistoryAction =
  | { type: HistoryActionType.PUSH; path: string; params: Record<string, string> }
  | { type: HistoryActionType.POP };
