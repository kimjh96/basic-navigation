import { ReactElement } from "react";

import { StackRouteProps } from "@core/StackRoute";

import ActivityProvider from "@core/activity/ActivityProvider";
import HistoryProvider from "@core/history/HistoryProvider";
import NavigationProvider from "@core/navigation/NavigationProvider";
import TransitionProvider from "@core/transition/TransitionProvider";

export interface StackRouterProps {
  children: ReactElement<StackRouteProps> | ReactElement<StackRouteProps>[];
}

function StackRouter({ children }: StackRouterProps) {
  return (
    <ActivityProvider stackRoutes={children}>
      <NavigationProvider>
        <HistoryProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </HistoryProvider>
      </NavigationProvider>
    </ActivityProvider>
  );
}

export default StackRouter;
