import { PropsWithChildren, useContext, useEffect, useReducer } from "react";

import type { StackRouterProps } from "@core/StackRouter";

import getParams from "@utils/getParams";
import isServer from "@utils/isServer";

import ActivityContext from "@core/activity/ActivityContext";
import HistoryContext from "@core/history/HistoryContext";
import { historyReducer } from "@core/history/store";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType } from "@core/navigation/typing";

function HistoryProvider({
  children,
  initPath
}: PropsWithChildren<Pick<StackRouterProps, "initPath">>) {
  const paths = useContext(ActivityContext).state.activities.map(({ path }) => path);
  const [state, dispatch] = useReducer(
    historyReducer,
    {
      index: 0,
      records: []
    },
    () => {
      const initialPath = isServer() ? initPath || "/" : window.location.pathname;
      const initialSearch = isServer() ? initialPath.split("?")[1] || "" : window.location.search;

      return {
        index: 0,
        records: [
          {
            path: initialPath,
            params: getParams(paths, initialPath, initialSearch)
          }
        ]
      };
    }
  );
  const { dispatch: navigationDispatch } = useContext(NavigationContext);

  useEffect(() => {
    window.history.replaceState({ index: 0 }, "");
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const nextIndex = e.state?.index;
      const { pathname, search } = window.location;
      const path = `${pathname}${search}`;
      const params = getParams(paths, pathname, search);

      if (nextIndex !== undefined) {
        const isBack = nextIndex < state.index;
        const isPush = nextIndex > state.index;

        if (isBack) {
          navigationDispatch({
            type: NavigationActionType.POP,
            path,
            params
          });
        } else if (isPush) {
          navigationDispatch({
            type: NavigationActionType.PUSH,
            path,
            params
          });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [paths, state.index, dispatch, navigationDispatch]);

  return <HistoryContext.Provider value={{ state, dispatch }}>{children}</HistoryContext.Provider>;
}

export default HistoryProvider;
