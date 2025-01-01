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
          params: action.params
        })
      };
    case NavigationActionType.STACK_PUSH:
      return {
        status: NavigationStatus.PUSH,
        events: state.events.concat({
          status: NavigationStatus.STACK_PUSH,
          path: action.path,
          params: action.params
        })
      };
    case NavigationActionType.REPLACE:
      return {
        status: NavigationStatus.REPLACE,
        events: state.events.concat({
          status: NavigationStatus.REPLACE,
          path: action.path,
          params: action.params
        })
      };
    case NavigationActionType.BACK:
      return {
        status: NavigationStatus.BACK,
        events: state.events.concat({
          status: NavigationStatus.BACK,
          path: action.path,
          params: action.params
        })
      };
    case NavigationActionType.READY:
      return {
        status: NavigationStatus.READY,
        events: state.events
      };
    case NavigationActionType.NAVIGATING:
      return {
        status: NavigationStatus.NAVIGATING,
        events: state.events.slice(0, state.events.length - 1)
      };
    case NavigationActionType.DONE:
      return {
        status: NavigationStatus.DONE,
        events: state.events
      };
    default:
      return state;
  }
}
