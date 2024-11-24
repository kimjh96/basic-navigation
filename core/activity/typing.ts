export interface Activity {
  name: string;
  path: string;
}

export const enum ActivityActionType {
  SET = "SET",
  UPDATE_CURRENT_ACTIVITY_BY_PATHNAME = "UPDATE_CURRENT_ACTIVITY_BY_PATHNAME",
  UPDATE_PREVIOUS_ACTIVITY_BY_PATHNAME = "UPDATE_PREVIOUS_ACTIVITY_BY_PATHNAME",
  UPDATE_WAITING_ACTIVITY_BY_PATHNAME = "UPDATE_WAITING_ACTIVITY_BY_PATHNAME"
}

export interface ActivityState {
  activities: Activity[];
  previousActivity?: Activity;
  currentActivity?: Activity;
  waitingActivity?: Activity;
}

export type ActivityAction =
  | { type: ActivityActionType.SET; state: ActivityState }
  | { type: ActivityActionType.UPDATE_CURRENT_ACTIVITY_BY_PATHNAME; path: string }
  | {
      type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY_BY_PATHNAME;
      path: string;
    }
  | {
      type: ActivityActionType.UPDATE_WAITING_ACTIVITY_BY_PATHNAME;
    };
