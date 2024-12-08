import { History, HistoryAction, HistoryActionType } from "@core/history/typing";

export function historyReducer(state: History, action: HistoryAction): History {
  switch (action.type) {
    case HistoryActionType.PUSH:
      return {
        index: state.index + 1,
        records: state.records.concat(action)
      };
    case HistoryActionType.POP:
      return {
        index: state.index - 1,
        records: state.records.slice(0, state.records.length - 1)
      };
    default:
      return state;
  }
}
