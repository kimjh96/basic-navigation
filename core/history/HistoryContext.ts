import { createContext, Dispatch } from "react";

import { History, HistoryAction } from "@core/history/typing";

interface HistoryContextProps {
  state: History;
  dispatch: Dispatch<HistoryAction>;
}

const HistoryContext = createContext<HistoryContextProps>({
  state: {
    index: 0,
    records: []
  },
  dispatch: () => {}
});

export default HistoryContext;
