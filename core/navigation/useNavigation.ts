import { useContext } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import HistoryContext from "@core/history/HistoryContext";
import { HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType } from "@core/navigation/typing";

export default function useNavigation() {
  const { state } = useContext(ActivityContext);
  const { dispatch } = useContext(HistoryContext);
  const { dispatch: navigationDispatch } = useContext(NavigationContext);

  return {
    push: (name: string) => {
      const nextActivity = state.activities.find((activity) => activity.name === name);

      if (!nextActivity) return;

      window.history.pushState(null, "", nextActivity.path);
      dispatch({ type: HistoryActionType.PUSH, path: nextActivity.path });
      navigationDispatch({ type: NavigationActionType.PUSH, path: nextActivity.path });
    },
    pop: () => window.history.back()
  };
}
