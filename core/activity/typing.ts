export interface Activity {
  [key: string]: string;
}

export const enum ActivityActionType {
  SET = "SET",
  UPDATE_CURRENT_ACTIVITY = "UPDATE_CURRENT_ACTIVITY",
  UPDATE_PREVIOUS_ACTIVITY = "UPDATE_PREVIOUS_ACTIVITY",
  UPDATE_WAITING_ACTIVITY = "UPDATE_WAITING_ACTIVITY"
}

export interface ActivityState {
  activities: Activity[];
  previousActivity?: Activity;
  currentActivity?: Activity;
  waitingActivity?: Activity;
}

export type ActivityAction =
  | { type: ActivityActionType.SET; state: ActivityState }
  | { type: ActivityActionType.UPDATE_CURRENT_ACTIVITY; path: string }
  | {
      type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY;
      path: string;
    }
  | {
      type: ActivityActionType.UPDATE_WAITING_ACTIVITY;
    };
