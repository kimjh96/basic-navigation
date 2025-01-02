import { pathToRegexp } from "path-to-regexp";

import { ActivityAction, ActivityActionType, ActivityState } from "@core/activity/typing";

export function activityReducer(state: ActivityState, action: ActivityAction): ActivityState {
  switch (action.type) {
    case ActivityActionType.UPDATE_CURRENT_ACTIVITY: {
      const [currentActivity] = state.activities
        .filter((activity) => {
          const [path] = action.path.split("?");

          return pathToRegexp(activity.path).regexp.test(path);
        })
        .map((activity) => ({
          ...activity,
          params: action.params,
          activePath: action.path,
          animate: action.animate
        }));

      return {
        activities: state.activities,
        previousActivity: state.currentActivity,
        currentActivity
      };
    }
    case ActivityActionType.UPDATE_PREVIOUS_ACTIVITY: {
      const [previousActivity] = state.activities
        .filter((activity) => {
          const [path] = action.path.split("?");

          return pathToRegexp(activity.path).regexp.test(path);
        })
        .map((activity) => ({
          ...activity,
          params: action.params,
          activePath: action.path,
          animate: action.animate
        }));

      return {
        activities: state.activities,
        previousActivity,
        currentActivity: state.previousActivity
      };
    }
    case ActivityActionType.UPDATE_SPECIFY_PREVIOUS_ACTIVITY: {
      const [previousActivity] = state.activities
        .filter((activity) => {
          const [path] = action.path.split("?");

          return pathToRegexp(activity.path).regexp.test(path);
        })
        .map((activity) => ({
          ...activity,
          params: action.params,
          activePath: action.path,
          animate: action.animate
        }));

      return {
        activities: state.activities,
        previousActivity,
        currentActivity: state.currentActivity
      };
    }
    case ActivityActionType.UPDATE_WAITING_ACTIVITY:
      return {
        activities: state.activities,
        previousActivity: state.previousActivity,
        currentActivity: state.currentActivity,
        waitingActivity: state.currentActivity
      };
    default:
      return state;
  }
}
