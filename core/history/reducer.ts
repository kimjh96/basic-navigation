import { History, HistoryAction, HistoryActionType } from "@core/history/typing";

export default function historyReducer(state: History, action: HistoryAction): History {
  switch (action.type) {
    case HistoryActionType.PUSH:
      return {
        index: state.index + 1,
        records: state.records.concat(action)
      };
    case HistoryActionType.STACK_PUSH:
      return {
        index: state.index + 1,
        records: state.records.concat(action)
      };
    case HistoryActionType.REPLACE:
      state.records.splice(state.records.length - 2, 1);
      return {
        index: state.index - 1,
        records: state.records
      };
    case HistoryActionType.BACK:
      return {
        index: state.index - 1,
        records: state.records.slice(0, state.records.length - 1)
      };
    default:
      return state;
  }
}
