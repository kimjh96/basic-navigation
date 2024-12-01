import { PropsWithChildren, ReactElement, useReducer } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { StackRouteProps } from "@core/StackRoute";

import type { StackRouterProps } from "@core/StackRouter";

import getActivities from "@utils/getActivities";

import getParams from "@utils/getParams";
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
  const [state, dispatch] = useReducer(
    activityReducer,
    {
      activities: getActivities(stackRoutes)
    },
    ({ activities }) => {
      const initialPath = isServer() ? initPath || "/" : window.location.pathname;
      const initialSearch = isServer() ? initialPath.split("?")[1] || "" : window.location.search;
      const [currentActivity] = activities.filter(({ path }) =>
        pathToRegexp(path || "/").regexp.test(initialPath)
      );
      const paths = activities.map(({ path }) => path);

      currentActivity.params = getParams(paths, initialPath, initialSearch);

      return {
        activities,
        previousActivity: currentActivity,
        currentActivity
      };
    }
  );

  return (
    <ActivityContext.Provider value={{ state, dispatch }}>{children}</ActivityContext.Provider>
  );
}

export default ActivityProvider;
