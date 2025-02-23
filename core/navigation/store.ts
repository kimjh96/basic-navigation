import {
  Navigation,
  NavigationAction,
  NavigationActionType,
  NavigationStatus
} from "@core/navigation/typing";

export function navigationReducer(state: Navigation, action: NavigationAction): Navigation {
  switch (action.type) {
    case NavigationActionType.PUSH:
      return {
        status: NavigationStatus.PUSH,
        events: state.events.concat({
          status: NavigationStatus.PUSH,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate
        })
      };
    case NavigationActionType.STACK_PUSH:
      return {
        status: NavigationStatus.PUSH,
        events: state.events.concat({
          status: NavigationStatus.STACK_PUSH,
          path: action.path,
          params: action.params,
          recordedAt: Date.now(),
          animate: action.animate
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
          animate: action.animate
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
          animate: action.animate
        })
      };
    case NavigationActionType.BACK_START:
      return {
        status: NavigationStatus.BACK_START,
        events: state.events
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
    case NavigationActionType.STACK_PUSH_NAVIGATING:
      return {
        status: NavigationStatus.STACK_PUSH_NAVIGATING,
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
    case NavigationActionType.STACK_PUSH_DONE:
      return {
        status: NavigationStatus.STACK_PUSH_DONE,
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
