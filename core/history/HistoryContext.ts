import { createContext, Dispatch } from "react";

import { History, HistoryAction } from "@core/history/typing";

interface HistoryContextProps {
  state: History;
  dispatch: Dispatch<HistoryAction>;
}

const HistoryContext = createContext<HistoryContextProps>({
  state: {
    records: []
  },
  dispatch: () => {}
});

export default HistoryContext;
