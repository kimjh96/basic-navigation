import {
  Navigation,
  NavigationAction,
  NavigationActionType,
  NavigationStatus
} from "@core/navigation/typing";

export default function navigationReducer(state: Navigation, action: NavigationAction): Navigation {
  switch (action.type) {
    case NavigationActionType.PUSH:
      return {
        status: NavigationStatus.PUSH,
        events: state.events.concat({
          status: NavigationStatus.PUSH,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate,
          animationType: action.animationType
        })
      };
    case NavigationActionType.PUSH_STACK:
      return {
        status: NavigationStatus.PUSH_STACK,
        events: state.events.concat({
          status: NavigationStatus.PUSH_STACK,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate,
          animationType: action.animationType
        })
      };
    case NavigationActionType.REPLACE:
      return {
        status: NavigationStatus.REPLACE,
        events: state.events.concat({
          status: NavigationStatus.REPLACE,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate,
          animationType: action.animationType
        })
      };
    case NavigationActionType.BACK:
      return {
        status: NavigationStatus.BACK,
        events: state.events.concat({
          status: NavigationStatus.BACK,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate,
          animationType: action.animationType
        })
      };
    case NavigationActionType.READY:
      return {
        status: NavigationStatus.READY,
        events: state.events
      };
    case NavigationActionType.PUSH_NAVIGATING:
      return {
        status: NavigationStatus.PUSH_NAVIGATING,
        events: state.events.slice(0, state.events.length - 1)
      };
    case NavigationActionType.PUSH_STACK_NAVIGATING:
      return {
        status: NavigationStatus.PUSH_STACK_NAVIGATING,
        events: state.events.slice(0, state.events.length - 1)
      };
    case NavigationActionType.REPLACE_NAVIGATING:
      return {
        status: NavigationStatus.REPLACE_NAVIGATING,
        events: state.events.slice(0, state.events.length - 1)
      };
    case NavigationActionType.BACK_NAVIGATING:
      return {
        status: NavigationStatus.BACK_NAVIGATING,
        events: state.events
      };
    case NavigationActionType.PUSH_DONE:
      return {
        status: NavigationStatus.PUSH_DONE,
        events: state.events
      };
    case NavigationActionType.PUSH_STACK_DONE:
      return {
        status: NavigationStatus.PUSH_STACK_DONE,
        events: state.events
      };
    case NavigationActionType.REPLACE_DONE:
      return {
        status: NavigationStatus.REPLACE_DONE,
        events: state.events
      };
    case NavigationActionType.BACK_DONE:
      return {
        status: NavigationStatus.BACK_DONE,
        events: state.events.slice(0, state.events.length - 1)
      };
    default:
      return state;
  }
}
