import { PropsWithChildren, useReducer } from "react";

import NavigationContext from "@core/navigation/NavigationContext";
import navigationReducer from "@core/navigation/reducer";
import { NavigationStatus } from "@core/navigation/typing";

function NavigationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(navigationReducer, {
    status: NavigationStatus.READY,
    events: []
  });

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>{children}</NavigationContext.Provider>
  );
}

export default NavigationProvider;
