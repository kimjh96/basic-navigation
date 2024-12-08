import { PropsWithChildren, useContext, useRef } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { BaseActivity, BaseActivityPath } from "@core/activity/typing";

export interface StackRouteProps<T extends BaseActivity["name"] = BaseActivity["name"]> {
  name: T;
  path: BaseActivityPath[T];
  params?: Record<string, string>;
  activePath?: string;
}

function StackRoute<T extends BaseActivity["name"]>({
  children,
  name,
  path,
  activePath
}: PropsWithChildren<StackRouteProps<T>>) {
  const {
    state: { currentActivity, previousActivity }
  } = useContext(ActivityContext);

  const ref = useRef<HTMLDivElement>(null);

  if (
    (currentActivity?.name !== name || currentActivity?.activePath !== activePath) &&
    (previousActivity?.name !== name || previousActivity?.activePath !== activePath)
  )
    return null;

  const isActiveActivity =
    currentActivity?.name === name && currentActivity?.activePath === activePath;

  return (
    <div
      ref={ref}
      data-path={path}
      data-active-path={activePath}
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
