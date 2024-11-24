import { pathToRegexp } from "path-to-regexp";

import { ActivityAction, ActivityActionType, ActivityState } from "@core/activity/typing";

export function activityReducer(state: ActivityState, action: ActivityAction): ActivityState {
  switch (action.type) {
    case ActivityActionType.SET:
      return action.state;
    case ActivityActionType.UPDATE_CURRENT_ACTIVITY_BY_PATHNAME:
      return {
        activities: state.activities,
        previousActivity: state.currentActivity,
        currentActivity: state.activities.find((activity) => {
          const [path] = action.path.split("?");

          return pathToRegexp(activity.path).regexp.test(path);
        })
      };
    case ActivityActionType.UPDATE_PREVIOUS_ACTIVITY_BY_PATHNAME:
      return {
        activities: state.activities,
        previousActivity: state.activities.find((activity) => {
          const [path] = action.path.split("?");

          return pathToRegexp(activity.path).regexp.test(path);
        }),
        currentActivity: state.previousActivity,
        waitingActivity: state.waitingActivity
      };
    case ActivityActionType.UPDATE_WAITING_ACTIVITY_BY_PATHNAME:
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
