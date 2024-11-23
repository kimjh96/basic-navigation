import {
  Navigation,
  NavigationAction,
  NavigationActionType,
  NavigationStatus
} from "@core/navigation/typing";

export function navigationReducer(state: Navigation, action: NavigationAction): Navigation {
  switch (action.type) {
    case NavigationActionType.SET:
      return action.navigation;
    case NavigationActionType.PUSH:
      return {
        status: NavigationStatus.PUSH,
        events: state.events.concat({
          status: NavigationStatus.PUSH,
          path: action.path
        })
      };
    case NavigationActionType.POP:
      return {
        status: NavigationStatus.POP,
        events: state.events.concat({
          status: NavigationStatus.POP,
          path: action.path
        })
      };
    case NavigationActionType.READY:
      return {
        status: NavigationStatus.READY,
        events: state.events
      };
    case NavigationActionType.DONE:
      return {
        status: NavigationStatus.DONE,
        events: state.events.slice(0, state.events.length - 1)
      };
    default:
      return state;
  }
}
