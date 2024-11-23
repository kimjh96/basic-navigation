import { History, HistoryAction, HistoryActionType } from "@core/history/typing";

export function historyReducer(state: History, action: HistoryAction): History {
  switch (action.type) {
    case HistoryActionType.SET:
      return action.state;
    case HistoryActionType.PUSH:
      return {
        records: state.records.concat(action.path)
      };
    case HistoryActionType.POP:
      return {
        records: state.records.slice(0, state.records.length - 1)
      };
    default:
      return state;
  }
}
