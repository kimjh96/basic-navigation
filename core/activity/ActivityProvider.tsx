import { PropsWithChildren, ReactElement, useReducer } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { StackRouteProps } from "@core/StackRoute";

import getActivities from "@utils/getActivities";

import ActivityContext from "@core/activity/ActivityContext";
import { activityReducer } from "@core/activity/store";

interface ActivityProviderProps {
  stackRoutes: ReactElement<StackRouteProps> | ReactElement<StackRouteProps>[];
}

function ActivityProvider({ children, stackRoutes }: PropsWithChildren<ActivityProviderProps>) {
  const activities = getActivities(stackRoutes);
  const [currentActivity] = activities.filter(({ path }) =>
    pathToRegexp(path || "").regexp.test(window.location.pathname)
  );
  const [state, dispatch] = useReducer(activityReducer, {
    activities,
    previousActivity: currentActivity,
    currentActivity
  });

  return (
    <ActivityContext.Provider value={{ state, dispatch }}>{children}</ActivityContext.Provider>
  );
}

export default ActivityProvider;
