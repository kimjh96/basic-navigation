import { createContext, Dispatch } from "react";

import { Transition, TransitionAction, TransitionStatus } from "@core/transition/typing";

interface TransitionContextProps {
  state: Transition;
  dispatch: Dispatch<TransitionAction>;
}

const TransitionContext = createContext<TransitionContextProps>({
  state: { status: TransitionStatus.DONE },
  dispatch: () => {}
});

export default TransitionContext;
