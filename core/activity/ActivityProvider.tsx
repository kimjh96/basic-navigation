import { PropsWithChildren, ReactElement, useReducer } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { StackRouteProps } from "@core/StackRoute";

import type { StackRouterProps } from "@core/StackRouter";

import getActivities from "@utils/getActivities";

import isServer from "@utils/isServer";

import ActivityContext from "@core/activity/ActivityContext";
import { activityReducer } from "@core/activity/store";

interface ActivityProviderProps extends Pick<StackRouterProps, "initPath"> {
  stackRoutes: ReactElement<StackRouteProps> | ReactElement<StackRouteProps>[];
}

function ActivityProvider({
  children,
  stackRoutes,
  initPath
}: PropsWithChildren<ActivityProviderProps>) {
  const activities = getActivities(stackRoutes);
  const [currentActivity] = activities.filter(({ path }) =>
    pathToRegexp(path || "/").regexp.test(isServer() ? initPath || "/" : window.location.pathname)
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
