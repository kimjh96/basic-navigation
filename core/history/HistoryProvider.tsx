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
      navigationDispatch({ type: NavigationActionType.POP, path: window.location.pathname });
      dispatch({ type: HistoryActionType.POP });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch, navigationDispatch]);

  return <HistoryContext.Provider value={{ state, dispatch }}>{children}</HistoryContext.Provider>;
}

export default HistoryProvider;
