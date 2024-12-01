import { useContext } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { BaseActivity, BaseActivityParams } from "@core/activity/typing";

export default function useActivityParams<T extends BaseActivity["name"]>(
  name: T
): BaseActivityParams[T] {
  const activity = useContext(ActivityContext).state.activities.find(
    (activity) => activity.name === name
  );

  if (activity?.params) {
    return activity.params;
  }

  return {};
}
