import { pathToRegexp } from "path-to-regexp";

import { ActivityAction, ActivityActionType, ActivityState } from "@core/activity/typing";

export function activityReducer(state: ActivityState, action: ActivityAction): ActivityState {
  switch (action.type) {
    case ActivityActionType.SET:
      return action.state;
    case ActivityActionType.UPDATE_CURRENT_ACTIVITY: {
      const currentActivity = state.activities.find((activity) => {
        const [path] = action.path.split("?");

        return pathToRegexp(activity.path).regexp.test(path);
      });

      currentActivity!.params = action.params;

      return {
        activities: state.activities,
        previousActivity: state.currentActivity,
        currentActivity
      };
    }
    case ActivityActionType.UPDATE_PREVIOUS_ACTIVITY: {
      const previousActivity = state.activities.find((activity) => {
        const [path] = action.path.split("?");

        return pathToRegexp(activity.path).regexp.test(path);
      });

      previousActivity!.params = action.params;

      return {
        activities: state.activities,
        previousActivity,
        currentActivity: state.previousActivity,
        waitingActivity: state.waitingActivity
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
