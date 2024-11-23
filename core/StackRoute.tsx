import { ReactNode, useContext, useRef } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { Activity } from "@core/activity/typing";

export interface StackRouteProps extends Pick<Activity, "name" | "path"> {
  activity: ReactNode;
}

function StackRoute({ activity, name, path }: StackRouteProps) {
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
      {activity}
    </div>
  );
}

export default StackRoute;
