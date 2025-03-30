import { PropsWithChildren, useContext, useEffect, useReducer } from "react";

import type { RouterProps } from "@core/Router";

import getParams from "@utils/getParams";
import isServer from "@utils/isServer";

import ActivityContext from "@core/activity/ActivityContext";
import HistoryContext from "@core/history/HistoryContext";
import { historyReducer } from "@core/history/store";
import { HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationStatus } from "@core/navigation/typing";

function HistoryProvider({ children, initPath }: PropsWithChildren<Pick<RouterProps, "initPath">>) {
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
            type: HistoryActionType.PUSH,
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
      const status = e.state?.status;
      const animate = e.state?.animate;
      const animationType = e.state?.animationType;
      const { pathname, search } = window.location;
      const path = `${pathname}${search}`;
      const params = getParams(paths, pathname, search);

      if (nextIndex !== undefined) {
        const isBack = nextIndex < state.index;
        const isPush = status === NavigationStatus.PUSH;
        const isStackPush = status === NavigationStatus.STACK_PUSH;
        const isReplace = status === NavigationStatus.REPLACE;

        if (isBack) {
          navigationDispatch({
            type: NavigationActionType.BACK,
            path,
            params,
            animate,
            animationType
          });
        } else if (isPush) {
          navigationDispatch({
            type: NavigationActionType.PUSH,
            path,
            params,
            animate,
            animationType
          });
        } else if (isStackPush) {
          navigationDispatch({
            type: NavigationActionType.STACK_PUSH,
            path,
            params,
            animate,
            animationType
          });
        } else if (isReplace) {
          navigationDispatch({
            type: NavigationActionType.PUSH,
            path,
            params,
            animate,
            animationType
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
