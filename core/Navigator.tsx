import { ReactElement } from "react";

import type { NavigateProps } from "@core/Navigate";

import ActivityProvider from "@core/activity/ActivityProvider";
import HistoryProvider from "@core/history/HistoryProvider";
import NavigationProvider from "@core/navigation/NavigationProvider";
import Renderer from "@core/renderer/Renderer";
import TransitionProvider from "@core/transition/TransitionProvider";

export interface NavigatorProps {
  children: ReactElement<NavigateProps> | ReactElement<NavigateProps>[];
  initPath?: string;
}

function Navigator({ children, initPath }: NavigatorProps) {
  return (
    <ActivityProvider navigates={children} initPath={initPath}>
      <NavigationProvider>
        <HistoryProvider initPath={initPath}>
          <TransitionProvider>
            <Renderer>{children}</Renderer>
          </TransitionProvider>
        </HistoryProvider>
      </NavigationProvider>
    </ActivityProvider>
  );
}

export default Navigator;
