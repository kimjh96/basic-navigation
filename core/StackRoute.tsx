import { PropsWithChildren, useContext, useRef } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { BaseActivity } from "@core/activity/typing";

export interface StackRouteProps {
  name: BaseActivity["name"];
  path: BaseActivity["path"];
}

function StackRoute({ children, name, path }: PropsWithChildren<StackRouteProps>) {
  const {
    state: { currentActivity, previousActivity }
  } = useContext(ActivityContext);

  const ref = useRef<HTMLDivElement>(null);

  const isPreviousActivity = previousActivity?.name === name;
  const isActiveActivity = currentActivity?.name === name;

  if (currentActivity?.name !== name && previousActivity?.name !== name) return null;

  return (
    <div
      ref={ref}
      data-path={path}
      data-root-activity={isActiveActivity && isPreviousActivity}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: isActiveActivity ? 1 : 0
      }}
    >
      {children}
    </div>
  );
}

export default StackRoute;
