import { useContext } from "react";

import { compile, match } from "path-to-regexp";

import ActivityContext from "@core/activity/ActivityContext";
import { Activity } from "@core/activity/typing";
import HistoryContext from "@core/history/HistoryContext";
import { HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType } from "@core/navigation/typing";

export default function useNavigation() {
  const { state } = useContext(ActivityContext);
  const { dispatch } = useContext(HistoryContext);
  const { dispatch: navigationDispatch } = useContext(NavigationContext);

  return {
    push: (name: Activity["name"], params?: object) => {
      const nextActivity = state.activities.find((activity) => activity.name === name);

      if (!nextActivity) return;

      const convertedParams = Object.fromEntries(
        Object.entries(params || {}).map(([key, value]) => [key, String(value)])
      );
      let nextPath = compile(nextActivity.path)(convertedParams);
      const nextPathMatch = match(nextActivity.path)(nextPath);
      const nextPathVariableKeys = nextPathMatch ? Object.keys(nextPathMatch?.params) : [];

      nextPathVariableKeys.forEach((key) => {
        delete convertedParams[key];
      });

      const queryStringParams = new URLSearchParams(
        Object.entries(convertedParams).map(([key, value]) => [key, String(value)])
      ).toString();

      nextPath = queryStringParams ? `${nextPath}?${queryStringParams}` : nextPath;

      window.history.pushState(null, "", nextPath);
      dispatch({ type: HistoryActionType.PUSH, path: nextPath });
      navigationDispatch({ type: NavigationActionType.PUSH, path: nextPath });
    },
    pop: () => window.history.back()
  };
}
