export interface History {
  index: number;
  records: { type: HistoryActionType; path: string; params: Record<string, string> }[];
}

export const enum HistoryActionType {
  PUSH = "PUSH",
  STACK_PUSH = "STACK_PUSH",
  POP = "POP"
}

export type HistoryAction =
  | { type: HistoryActionType.PUSH; path: string; params: Record<string, string> }
  | { type: HistoryActionType.STACK_PUSH; path: string; params: Record<string, string> }
  | { type: HistoryActionType.POP };
