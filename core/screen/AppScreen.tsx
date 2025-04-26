import {
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  TouchEvent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import ActivityContext from "@core/activity/ActivityContext";
import Animator from "@core/animation/Animator";
import { AnimationType } from "@core/animation/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationStatus } from "@core/navigation/typing";
import TransitionContext from "@core/transition/TransitionContext";
import { TransitionActionType } from "@core/transition/typing";
import useDebounceCallback from "@hooks/useDebounceCallback";

interface AppScreenProps {
  appBar?: ReactNode;
  appBarHeight?: number;
  bottomNavigationBar?: ReactNode;
  bottomNavigationBarHeight?: number;
  backgroundColor?: string;
}

function AppScreen({
  children,
  appBar,
  appBarHeight = 0,
  bottomNavigationBar,
  bottomNavigationBarHeight = 0,
  backgroundColor = "white"
}: PropsWithChildren<AppScreenProps>) {
  const {
    state: { currentActivity, previousActivity, waitingActivity }
  } = useContext(ActivityContext);
  const { dispatch } = useContext(TransitionContext);
  const {
    state: { status }
  } = useContext(NavigationContext);

  const [transitionPreparationStyle, setTransitionPreparationStyle] = useState(() => {
    const animationStatus = [NavigationStatus.READY, NavigationStatus.REPLACE_DONE].includes(status)
      ? "ready-to-activate"
      : "ready-to-deactivate";

    return {
      style: Animator.getTransitionPreparationStyle(
        animationStatus,
        currentActivity?.animationType
      ),
      status: animationStatus
    };
  });
  const [enableBackdrop, setEnableBackdrop] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const isScrollingRef = useRef(false);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const currentClientXRef = useRef(0);
  const isTransitionEndRef = useRef(true);
  const transitionEndTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animatorRef = useRef<Animator>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const startTransition = ({
    clientX,
    clientY,
    scrollTop
  }: {
    clientX: number;
    clientY: number;
    scrollTop: number;
  }) => {
    if (!currentActivity?.animate) return;

    currentClientXRef.current = 0;
    startClientXRef.current = clientX;
    startClientYRef.current = clientY;
    startScrollTopRef.current = scrollTop;
    isTransitioningRef.current = true;

    animatorRef.current?.deactivatePreviousActivityElement(false, "ready-for-activation");
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
    startTransition({
      clientX: e.clientX,
      clientY: e.clientY,
      scrollTop: e.currentTarget.scrollTop
    });

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) =>
    startTransition({
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      scrollTop: e.currentTarget.scrollTop
    });

  const handleScrollEnd = useDebounceCallback(() => {
    isScrollingRef.current = false;
  }, 300);

  useEffect(() => {
    if (ref.current) {
      animatorRef.current = new Animator(
        () => ref.current?.parentElement?.previousElementSibling as HTMLElement,
        () => ref.current || undefined,
        currentActivity?.animationType as AnimationType
      );
    }
  }, [currentActivity?.animationType]);

  // 현재 화면이 활성화되었을 때 실행되는 로직
  useEffect(() => {
    const activePath =
      animatorRef?.current?.currentActivityElement?.parentElement?.getAttribute("data-active-path");
    const previousActivePath = animatorRef?.current?.previousActivityElement;

    if (
      activePath === currentActivity?.activePath &&
      previousActivePath !== currentActivity?.activePath
    ) {
      animatorRef.current?.restoreCurrentActivityElementScroll();
      animatorRef.current?.deactivatePreviousActivityElement(
        currentActivity?.animate,
        "ready-for-activation"
      );
      animatorRef.current?.activateCurrentActivityElement(currentActivity?.animate);

      setTransitionPreparationStyle({
        style: Animator.getTransitionPreparationStyle(
          "ready-to-activate",
          currentActivity?.animationType
        ),
        status: "ready-to-activate"
      });
      setEnableBackdrop(!!animatorRef.current?.animation?.enableBackdrop);
    }
  }, [currentActivity?.activePath, currentActivity?.animate, currentActivity?.animationType]);

  // 이전 화면이 다시 현재 화면으로 복원될 때 실행되는 로직
  useEffect(() => {
    const activePath =
      animatorRef?.current?.currentActivityElement?.parentElement?.getAttribute("data-active-path");

    if (activePath === previousActivity?.activePath) {
      animatorRef.current?.activatePreviousActivityElement(previousActivity?.animate);

      setTransitionPreparationStyle({
        style: Animator.getTransitionPreparationStyle(
          "ready-to-activate",
          previousActivity?.animationType
        ),
        status: "ready-to-activate"
      });
    }
  }, [previousActivity?.activePath, previousActivity?.animate, previousActivity?.animationType]);

  // 현재 화면이 백그라운드로 이동하고 이전 화면이 활성화될 때 실행되는 로직
  useEffect(() => {
    const activePath =
      animatorRef?.current?.currentActivityElement?.parentElement?.getAttribute("data-active-path");

    if (
      activePath === waitingActivity?.activePath &&
      transitionPreparationStyle.status === "ready-to-activate"
    ) {
      animatorRef.current?.activatePreviousActivityElement(waitingActivity?.animate);
      animatorRef.current?.deactivateCurrentActivityElement(
        waitingActivity?.animate,
        "ready-for-deactivation"
      );

      setTransitionPreparationStyle({
        style: Animator.getTransitionPreparationStyle(
          "ready-to-deactivate",
          waitingActivity?.animationType
        ),
        status: "ready-to-deactivate"
      });
    }
  }, [
    waitingActivity?.activePath,
    waitingActivity?.animate,
    waitingActivity?.animationType,
    transitionPreparationStyle.status
  ]);

  useEffect(() => {
    const currentActivityElement = ref.current;

    const handleScroll = () => {
      isScrollingRef.current = true;
    };

    currentActivityElement?.addEventListener("scroll", handleScroll);
    currentActivityElement?.addEventListener("scroll", handleScrollEnd);

    return () => {
      currentActivityElement?.removeEventListener("scroll", handleScroll);
      currentActivityElement?.removeEventListener("scroll", handleScrollEnd);
    };
  }, [handleScrollEnd]);

  useEffect(() => {
    const currentActivityElement = ref.current;

    const transitioning = ({
      e,
      clientX,
      clientY
    }: {
      e: globalThis.MouseEvent | globalThis.TouchEvent;
      clientX: number;
      clientY: number;
    }) => {
      if (!isTransitioningRef.current || isScrollingRef.current) return;

      currentClientXRef.current = clientX - startClientXRef.current;

      const deltaY = Math.abs(clientY - startClientYRef.current);
      const deltaX = Math.abs(currentClientXRef.current);
      const notYet = deltaY > deltaX || currentClientXRef.current < 0;

      if (notYet) {
        animatorRef.current?.deactivatePreviousActivityElement();
        animatorRef.current?.activateCurrentActivityElement();
        currentClientXRef.current = 1; // 사용자 제스처를 무시하고 클릭 이벤트가 전파되는 것을 방지

        isTransitioningRef.current = false;

        dispatch({
          type: TransitionActionType.DONE
        });
        return;
      }

      const progress = deltaX / window.innerWidth;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      if (animatorRef.current?.animation?.enableBackdrop) {
        if (backdropRef.current) {
          backdropRef.current.style.transition = "none";
          backdropRef.current.style.opacity = `${1 - clampedProgress}`;
        }
      }

      dispatch({
        type: TransitionActionType.PENDING
      });

      animatorRef.current?.updatePreviousActivityElementProgress(clampedProgress);
      animatorRef.current?.updateCurrentActivityElementProgress(
        clampedProgress,
        currentClientXRef.current
      );

      const targetElement = e.target as HTMLElement;

      if (targetElement.className === "screen-bar" || e.cancelable) {
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: globalThis.MouseEvent) =>
      transitioning({
        e,
        clientX: e.clientX,
        clientY: e.clientY
      });

    const handleTouchMove = (e: globalThis.TouchEvent) =>
      transitioning({
        e,
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      });

    currentActivityElement?.addEventListener("mousemove", handleMouseMove);
    currentActivityElement?.addEventListener("touchmove", handleTouchMove);

    return () => {
      currentActivityElement?.removeEventListener("mousemove", handleMouseMove);
      currentActivityElement?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dispatch]);

  useEffect(() => {
    const endTransition = () => {
      if (!currentActivity?.animate || transitionPreparationStyle.status === "ready-to-deactivate")
        return;

      isTransitioningRef.current = false;
      isTransitionEndRef.current = false;

      if (animatorRef.current?.animation?.enableBackdrop) {
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.3s";
          backdropRef.current.style.opacity = "1";
        }
      }

      const isTriggered = currentClientXRef.current >= 30;

      if (isTriggered) {
        animatorRef.current?.activatePreviousActivityElement();
        animatorRef.current?.deactivateCurrentActivityElement();

        window.history.back();
      } else {
        animatorRef.current?.deactivatePreviousActivityElement(true, "ready-for-activation");
        animatorRef.current?.activateCurrentActivityElement();
      }

      if (transitionEndTimerRef.current) {
        clearTimeout(transitionEndTimerRef.current);
      }

      transitionEndTimerRef.current = setTimeout(() => {
        isTransitionEndRef.current = true;
        dispatch({
          type: TransitionActionType.DONE
        });
      }, 50);
    };

    const handleMouseUp = () => endTransition();

    const handleTouchEnd = () => endTransition();

    animatorRef?.current?.currentActivityElement?.addEventListener("mouseup", handleMouseUp);
    animatorRef?.current?.currentActivityElement?.addEventListener("touchend", handleTouchEnd);

    return () => {
      animatorRef?.current?.currentActivityElement?.removeEventListener("mouseup", handleMouseUp);
      animatorRef?.current?.currentActivityElement?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentActivity?.animate, dispatch, transitionPreparationStyle.status]);

  useEffect(() => {
    const currentActivityElement = ref.current;

    const handleClick = (e: globalThis.MouseEvent) => {
      if (!isTransitionEndRef.current && currentClientXRef.current >= 1) {
        e.stopPropagation();
      }
    };

    currentActivityElement?.addEventListener("click", handleClick);

    return () => {
      currentActivityElement?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div
        className={"screen-bar"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: "100%",
          zIndex: 0
        }}
      />
      <div
        ref={backdropRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          transition: "opacity 0.3s",
          opacity:
            currentActivity?.animate &&
            transitionPreparationStyle.status === "ready-to-activate" &&
            enableBackdrop
              ? 1
              : 0,
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      {appBar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
            minHeight: appBarHeight,
            maxHeight: appBarHeight
          }}
        >
          {appBar}
        </div>
      )}
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          marginTop: appBarHeight,
          marginBottom: bottomNavigationBarHeight,
          width: "100%",
          height: `calc(100% - ${appBarHeight}px - ${bottomNavigationBarHeight}px)`,
          overflow: "auto",
          overscrollBehavior: "none",
          backgroundColor,
          ...transitionPreparationStyle.style
        }}
      >
        {children}
      </div>
      {bottomNavigationBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
            minHeight: bottomNavigationBarHeight,
            maxHeight: bottomNavigationBarHeight
          }}
        >
          {bottomNavigationBar}
        </div>
      )}
    </>
  );
}

export default AppScreen;

declare global {
  interface Window {
    scrollContainer: HTMLDivElement | null;
  }
}
