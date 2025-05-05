import { AnimationType } from "@core/animator/typing";

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
  isRoot: boolean;
  animate?: boolean;
  animationType?: AnimationType;
}

export const enum ActivityActionType {
  UPDATE_CURRENT_ACTIVITY = "UPDATE_CURRENT_ACTIVITY",
  UPDATE_PREVIOUS_ACTIVITY = "UPDATE_PREVIOUS_ACTIVITY",
  UPDATE_SPECIFY_PREVIOUS_ACTIVITY = "UPDATE_SPECIFY_PREVIOUS_ACTIVITY",
  UPDATE_PREPARING_ACTIVITY = "UPDATE_PREPARING_ACTIVITY"
}

export interface ActivityState {
  activities: Activity[];
  previousActivity?: Activity;
  currentActivity?: Activity;
  preparingActivity?: Activity;
}

export type ActivityAction =
  | {
      type: ActivityActionType.UPDATE_CURRENT_ACTIVITY;
      path: string;
      params: Record<string, string>;
      activity?: Activity;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: ActivityActionType.UPDATE_SPECIFY_PREVIOUS_ACTIVITY;
      path: string;
      params: Record<string, string>;
      animate?: boolean;
      animationType?: AnimationType;
    }
  | {
      type: ActivityActionType.UPDATE_PREPARING_ACTIVITY;
    };
