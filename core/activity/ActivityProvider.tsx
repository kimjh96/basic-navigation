import { PropsWithChildren, ReactElement, useReducer } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { NavigateProps } from "@core/Navigate";

import type { NavigatorProps } from "@core/Navigator";

import getActivities from "@utils/getActivities";

import getParams from "@utils/getParams";
import isServer from "@utils/isServer";

import ActivityContext from "@core/activity/ActivityContext";
import { activityReducer } from "@core/activity/store";

interface ActivityProviderProps extends Pick<NavigatorProps, "initPath"> {
  navigates: ReactElement<NavigateProps> | ReactElement<NavigateProps>[];
}

function ActivityProvider({
  children,
  navigates,
  initPath
}: PropsWithChildren<ActivityProviderProps>) {
  const [state, dispatch] = useReducer(
    activityReducer,
    {
      activities: getActivities(navigates)
    },
    ({ activities }) => {
      const initialPath = isServer() ? initPath || "/" : window.location.pathname;
      const initialSearch = isServer() ? initialPath.split("?")[1] || "" : window.location.search;
      const paths = activities.map(({ path }) => path);
      const [currentActivity] = activities
        .filter(({ path }) => pathToRegexp(path || "/").regexp.test(initialPath))
        .map((activity) => ({
          ...activity,
          params: getParams(paths, initialPath, initialSearch),
          activePath: initialPath
        }));

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
