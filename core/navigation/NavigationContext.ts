import { createContext, Dispatch } from "react";

import { Navigation, NavigationStatus, NavigationAction } from "@core/navigation/typing";

interface NavigationContextProps {
  state: Navigation;
  dispatch: Dispatch<NavigationAction>;
}

const NavigationContext = createContext<NavigationContextProps>({
  state: { status: NavigationStatus.READY, events: [] },
  dispatch: () => {}
});

export default NavigationContext;
