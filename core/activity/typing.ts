export interface BaseActivity {
  [key: string]: string;
}

export interface BaseActivityPath {
  [key: BaseActivity["name"]]: string;
}

export interface BaseActivityParams {
  [key: BaseActivity["name"]]: Record<string, string>;
}

export interface Activity {
  name: BaseActivity["name"];
  path: BaseActivityPath[BaseActivity["name"]];
  params: BaseActivityParams[BaseActivity["name"]];
  activePath: string;
  animate?: boolean;
}

export const enum ActivityActionType {
  UPDATE_CURRENT_ACTIVITY = "UPDATE_CURRENT_ACTIVITY",
  UPDATE_PREVIOUS_ACTIVITY = "UPDATE_PREVIOUS_ACTIVITY",
  UPDATE_SPECIFY_PREVIOUS_ACTIVITY = "UPDATE_SPECIFY_PREVIOUS_ACTIVITY",
  UPDATE_WAITING_ACTIVITY = "UPDATE_WAITING_ACTIVITY"
}

export interface ActivityState {
  activities: Activity[];
  previousActivity?: Activity;
  currentActivity?: Activity;
  waitingActivity?: Activity;
}

export type ActivityAction =
  | {
      type: ActivityActionType.UPDATE_CURRENT_ACTIVITY;
      path: string;
      params: Record<string, string>;
      activity?: Activity;
      animate?: boolean;
    }
  | {
      type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: ActivityActionType.UPDATE_SPECIFY_PREVIOUS_ACTIVITY;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
    }
  | {
      type: ActivityActionType.UPDATE_WAITING_ACTIVITY;
    };
