import { PropsWithChildren, useContext, useRef } from "react";

import { Freeze } from "react-freeze";

import ActivityContext from "@core/activity/ActivityContext";
import { BaseActivity, BaseActivityPath } from "@core/activity/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationStatus } from "@core/navigation/typing";
import TransitionContext from "@core/transition/TransitionContext";
import { TransitionStatus } from "@core/transition/typing";

export interface NavigateProps<T extends BaseActivity["name"] = BaseActivity["name"]> {
  name: T;
  path: BaseActivityPath[T];
  params?: Record<string, string>;
  activePath?: string;
}

function Navigate<T extends BaseActivity["name"]>({
  children,
  name,
  path,
  activePath
}: PropsWithChildren<NavigateProps<T>>) {
  const {
    state: { currentActivity, previousActivity }
  } = useContext(ActivityContext);
  const {
    state: { status: navigationStatus }
  } = useContext(NavigationContext);
  const {
    state: { status: transitionStatus }
  } = useContext(TransitionContext);

  const ref = useRef<HTMLDivElement>(null);

  const isNeitherActiveNorPrev =
    (currentActivity?.name !== name || currentActivity?.activePath !== activePath) &&
    (previousActivity?.name !== name || previousActivity?.activePath !== activePath);

  if (isNeitherActiveNorPrev) return null;

  const isActive = currentActivity?.name === name && currentActivity?.activePath === activePath;
  const isNavigated =
    navigationStatus === NavigationStatus.READY ||
    navigationStatus === NavigationStatus.PUSH_DONE ||
    navigationStatus === NavigationStatus.STACK_PUSH_DONE ||
    navigationStatus === NavigationStatus.REPLACE_DONE ||
    navigationStatus === NavigationStatus.BACK_DONE;
  const isFrozen = !isActive && isNavigated && transitionStatus == TransitionStatus.DONE;

  return (
    <div
      ref={ref}
      data-path={path}
      data-active-path={activePath}
      style={{
        display: isFrozen ? "none" : undefined,
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: isActive ? 1 : 0,
        pointerEvents: isNavigated ? undefined : "none"
      }}
    >
      <Freeze freeze={isFrozen}>{children}</Freeze>
    </div>
  );
}

export default Navigate;
