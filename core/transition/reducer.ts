import {
  Transition,
  TransitionAction,
  TransitionActionType,
  TransitionStatus
} from "@core/transition/typing";

export default function transitionReducer(state: Transition, action: TransitionAction): Transition {
  switch (action.type) {
    case TransitionActionType.PENDING:
      return {
        status: TransitionStatus.PENDING
      };
    case TransitionActionType.DONE:
      return {
        status: TransitionStatus.DONE
      };
    default:
      return state;
  }
}
