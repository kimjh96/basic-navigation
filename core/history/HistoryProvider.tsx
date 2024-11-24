import { PropsWithChildren, useContext, useEffect, useReducer } from "react";

import HistoryContext from "@core/history/HistoryContext";
import { historyReducer } from "@core/history/store";
import { HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType } from "@core/navigation/typing";

function HistoryProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(historyReducer, {
    records: [window.location.pathname]
  });
  const { dispatch: navigationDispatch } = useContext(NavigationContext);

  useEffect(() => {
    const handlePopState = () => {
      const { pathname, search } = window.location;
      const path = `${pathname}${search}`;
      const isBack = state.records[state.records.length - 2] === path;

      if (isBack) {
        dispatch({ type: HistoryActionType.POP });
        navigationDispatch({
          type: NavigationActionType.POP,
          path
        });
      } else {
        dispatch({ type: HistoryActionType.PUSH, path });
        navigationDispatch({
          type: NavigationActionType.PUSH,
          path
        });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [state.records, dispatch, navigationDispatch]);

  return <HistoryContext.Provider value={{ state, dispatch }}>{children}</HistoryContext.Provider>;
}

export default HistoryProvider;
