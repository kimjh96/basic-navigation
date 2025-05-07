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
import Animator from "@core/animator/Animator";
import { AnimationType } from "@core/animator/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationStatus } from "@core/navigation/typing";
import TransitionContext from "@core/transition/TransitionContext";
import { TransitionActionType } from "@core/transition/typing";
import useDebounceCallback from "@hooks/useDebounceCallback";

interface AppScreenProps {
  statusBarHeight?: string;
  statusBarColor?: string;
  systemBottomNavigationBarHeight?: string;
  systemBottomNavigationBarColor?: string;
  appBar?: ReactNode;
  appBarHeight?: string;
  bottomNavigationBar?: ReactNode;
  bottomNavigationBarHeight?: string;
  backgroundColor?: string;
  backdropColor?: string;
  hideStatusBar?: boolean;
  hideSystemBottomNavigationBar?: boolean;
}

// TODO 리팩토링
function AppScreen({
  children,
  statusBarHeight = "env(safe-area-inset-top)",
  statusBarColor = "white",
  systemBottomNavigationBarHeight = "env(safe-area-inset-bottom)",
  systemBottomNavigationBarColor = "white",
  appBar,
  appBarHeight = "0px",
  bottomNavigationBar,
  bottomNavigationBarHeight = "0px",
  backgroundColor = "white",
  backdropColor = "rgba(0, 0, 0, 0.3)",
  hideStatusBar,
  hideSystemBottomNavigationBar
}: PropsWithChildren<AppScreenProps>) {
  const {
    state: { currentActivity, previousActivity, preparingActivity }
  } = useContext(ActivityContext);
  const { dispatch } = useContext(TransitionContext);
  const {
    state: { status }
  } = useContext(NavigationContext);

  const [preparationStyle, setPreparationStyle] = useState(() => {
    const animationStatus = [NavigationStatus.READY, NavigationStatus.REPLACE_DONE].includes(status)
      ? "active-initial"
      : "inactive-initial";

    return {
      style: Animator.getPreparationStyle(animationStatus, currentActivity?.animationType),
      status: animationStatus
    };
  });

  const ref = useRef<HTMLDivElement>(null);
  const isSwipingRef = useRef(false);
  const isScrollingRef = useRef(false);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const currentClientXRef = useRef(0);
  const currentClientYRef = useRef(0);
  const isSwipeEndRef = useRef(true);
  const swipeEndTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animatorRef = useRef<Animator>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const currentActivePathRef = useRef("");
  const previousActivePathRef = useRef("");

  const startSwipe = ({
    clientX,
    clientY,
    scrollTop
  }: {
    clientX: number;
    clientY: number;
    scrollTop: number;
  }) => {
    if (
      !currentActivity?.animate ||
      status === NavigationStatus.PUSH_STACK_DONE ||
      !window.history.state.index
    )
      return;

    currentClientXRef.current = 0;
    startClientXRef.current = clientX;
    startClientYRef.current = clientY;
    startScrollTopRef.current = scrollTop;
    isSwipingRef.current = true;

    animatorRef.current?.hidePrevious(false, "preparing-active");
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
    startSwipe({
      clientX: e.clientX,
      clientY: e.clientY,
      scrollTop: e.currentTarget.scrollTop
    });

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) =>
    startSwipe({
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
        () => ref.current?.parentElement?.parentElement?.previousElementSibling as HTMLDivElement,
        () => ref.current || undefined,
        currentActivity?.animationType as AnimationType
      );
      currentActivePathRef.current =
        animatorRef?.current?.current?.parentElement?.parentElement?.getAttribute(
          "data-active-path"
        ) || "";
      previousActivePathRef.current =
        animatorRef?.current?.previous?.getAttribute("data-active-path") || "";

      window.appScreen = ref.current;
      if (window.appScreen) {
        window.appScreen.scrollTo({
          top: window.history.state?.scrollTop || 0
        });
      }
    }
  }, [currentActivity?.animationType]);

  // 현재 화면이 활성화되었을 때 실행되는 로직
  useEffect(() => {
    if (
      currentActivePathRef.current === currentActivity?.activePath &&
      previousActivePathRef.current !== currentActivity?.activePath
    ) {
      animatorRef.current?.hidePrevious(currentActivity?.animate, "preparing-active");
      animatorRef.current?.showCurrent(currentActivity?.animate);

      if (animatorRef.current?.animation?.enableBackdrop && !!window.history.state?.index) {
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.3s";
          backdropRef.current.style.opacity = "1";
        }
      }

      setPreparationStyle({
        style: Animator.getPreparationStyle("active-initial", currentActivity?.animationType),
        status: "active-initial"
      });
    }
  }, [currentActivity?.activePath, currentActivity?.animate, currentActivity?.animationType]);

  // 이전 화면이 다시 현재 화면으로 활성화될 때 실행되는 로직
  useEffect(() => {
    if (currentActivePathRef.current === previousActivity?.activePath) {
      animatorRef.current?.showPrevious(previousActivity?.animate);

      setPreparationStyle({
        style: Animator.getPreparationStyle("active-initial", previousActivity?.animationType),
        status: "active-initial"
      });
    }
  }, [previousActivity?.activePath, previousActivity?.animate, previousActivity?.animationType]);

  // 현재 화면이 비활성화 되고 이전 화면이 활성화될 때 실행되는 로직
  useEffect(() => {
    if (
      currentActivePathRef.current === preparingActivity?.activePath &&
      preparationStyle.status === "active-initial"
    ) {
      animatorRef.current?.showPrevious(preparingActivity?.animate);
      animatorRef.current?.hideCurrent(preparingActivity?.animate, "preparing-inactive");

      if (animatorRef.current?.animation?.enableBackdrop) {
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.3s";
          backdropRef.current.style.opacity = "0";
        }
      }

      setPreparationStyle({
        style: Animator.getPreparationStyle("inactive-initial", preparingActivity?.animationType),
        status: "inactive-initial"
      });
    }
  }, [
    preparingActivity?.activePath,
    preparingActivity?.animate,
    preparingActivity?.animationType,
    preparationStyle.status
  ]);

  useEffect(() => {
    const currentScreenElement = ref.current;

    const handleScroll = () => {
      isScrollingRef.current = true;
    };

    currentScreenElement?.addEventListener("scroll", handleScroll);
    currentScreenElement?.addEventListener("scroll", handleScrollEnd);

    return () => {
      currentScreenElement?.removeEventListener("scroll", handleScroll);
      currentScreenElement?.removeEventListener("scroll", handleScrollEnd);
    };
  }, [handleScrollEnd]);

  useEffect(() => {
    const currentScreenElement = ref.current;

    const swipe = ({
      e,
      clientX,
      clientY
    }: {
      e: globalThis.MouseEvent | globalThis.TouchEvent;
      clientX: number;
      clientY: number;
    }) => {
      if (!isSwipingRef.current || isScrollingRef.current) return;

      currentClientXRef.current = clientX - startClientXRef.current;
      currentClientYRef.current = clientY - startClientYRef.current;

      const deltaY = Math.abs(currentClientYRef.current);
      const deltaX = Math.abs(currentClientXRef.current);
      const swipeBackDirection = animatorRef.current?.animation?.swipeBackDirection;

      let notYet = false;
      if (swipeBackDirection === "horizontal") {
        notYet = deltaY > deltaX || currentClientXRef.current < 0;
      } else {
        const scrollTop = animatorRef?.current?.current?.scrollTop ?? 0;
        notYet = deltaX > deltaY || currentClientYRef.current < 0 || scrollTop > 0;
      }

      if (notYet) {
        animatorRef.current?.hidePrevious();
        animatorRef.current?.showCurrent();
        currentClientXRef.current = 1; // 사용자 제스처를 무시하고 클릭 이벤트가 전파되는 것을 방지

        isSwipingRef.current = false;

        swipeEndTimerRef.current = setTimeout(() => {
          dispatch({
            type: TransitionActionType.DONE
          });
        }, 300);
        return;
      }

      dispatch({
        type: TransitionActionType.PENDING
      });

      const progress =
        swipeBackDirection === "horizontal"
          ? deltaX / window.innerWidth
          : deltaY / window.innerHeight;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      if (animatorRef.current?.animation?.enableBackdrop) {
        if (backdropRef.current) {
          backdropRef.current.style.transition = "none";
          backdropRef.current.style.opacity = `${1 - clampedProgress}`;
        }
      }

      animatorRef.current?.updatePreviousProgress(clampedProgress);
      animatorRef.current?.updateCurrentProgress(
        clampedProgress,
        swipeBackDirection === "horizontal" ? currentClientXRef.current : currentClientYRef.current
      );

      const targetElement = e.target as HTMLElement;

      if (targetElement.className === "screen-bar" || e.cancelable) {
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: globalThis.MouseEvent) =>
      swipe({
        e,
        clientX: e.clientX,
        clientY: e.clientY
      });

    const handleTouchMove = (e: globalThis.TouchEvent) =>
      swipe({
        e,
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      });

    currentScreenElement?.addEventListener("mousemove", handleMouseMove);
    currentScreenElement?.addEventListener("touchmove", handleTouchMove);

    return () => {
      if (swipeEndTimerRef.current) {
        clearTimeout(swipeEndTimerRef.current);
      }

      currentScreenElement?.removeEventListener("mousemove", handleMouseMove);
      currentScreenElement?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dispatch]);

  useEffect(() => {
    const endSwipe = () => {
      if (!currentActivity?.animate || preparationStyle.status === "inactive-initial") return;

      isSwipingRef.current = false;
      isSwipeEndRef.current = false;

      const swipeBackDirection = animatorRef.current?.animation?.swipeBackDirection;

      const isTriggered =
        swipeBackDirection === "horizontal"
          ? currentClientXRef.current >= 30
          : currentClientYRef.current >= 30;

      if (isTriggered) {
        animatorRef.current?.showPrevious();
        animatorRef.current?.hideCurrent();

        window.history.back();
      } else {
        animatorRef.current?.hidePrevious(true, "preparing-active");
        animatorRef.current?.showCurrent();
      }

      if (swipeEndTimerRef.current) {
        clearTimeout(swipeEndTimerRef.current);
      }

      swipeEndTimerRef.current = setTimeout(() => {
        isSwipeEndRef.current = true;
        swipeEndTimerRef.current = setTimeout(() => {
          dispatch({
            type: TransitionActionType.DONE
          });
        }, 300);
      }, 50);
    };

    const handleMouseUp = () => endSwipe();

    const handleTouchEnd = () => endSwipe();

    animatorRef?.current?.current?.addEventListener("mouseup", handleMouseUp);
    animatorRef?.current?.current?.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (swipeEndTimerRef.current) {
        clearTimeout(swipeEndTimerRef.current);
      }

      animatorRef?.current?.current?.removeEventListener("mouseup", handleMouseUp);
      animatorRef?.current?.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentActivity?.animate, dispatch, preparationStyle.status]);

  useEffect(() => {
    const currentScreenElement = ref.current;

    const handleClick = (e: globalThis.MouseEvent) => {
      if (!isSwipeEndRef.current && currentClientXRef.current >= 1) {
        e.stopPropagation();
      }
    };

    currentScreenElement?.addEventListener("click", handleClick);

    return () => {
      currentScreenElement?.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (status === NavigationStatus.PUSH_STACK_DONE) {
      if (backdropRef.current) {
        backdropRef.current.style.transition = "opacity 0.3s";
        backdropRef.current.style.opacity = "0";
      }
    }
  }, [status]);

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
          backgroundColor: backdropColor,
          transition: "opacity 0.3s",
          opacity: 0,
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
            minHeight: `calc(${appBarHeight} + ${hideStatusBar ? "0px" : statusBarHeight})`
          }}
        >
          {appBar}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%"
        }}
      >
        {!hideStatusBar && (
          <div
            style={{
              width: "100%",
              minHeight: statusBarHeight,
              backgroundColor: statusBarColor,
              transition: "background-color 0.3s",
              zIndex: 1
            }}
          />
        )}
        {appBar && (
          <div
            style={{
              width: "100%",
              minHeight: appBarHeight
            }}
          />
        )}
        <div
          ref={ref}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
            overflow: "auto",
            overscrollBehavior: "none",
            backgroundColor,
            ...preparationStyle.style
          }}
        >
          {children}
        </div>
        {bottomNavigationBar && (
          <div
            style={{
              width: "100%",
              minHeight: bottomNavigationBarHeight
            }}
          />
        )}
        {!hideSystemBottomNavigationBar && (
          <div
            style={{
              width: "100%",
              minHeight: systemBottomNavigationBarHeight,
              backgroundColor: systemBottomNavigationBarColor,
              transition: "background-color 0.3s",
              zIndex: 1
            }}
          />
        )}
      </div>
      {bottomNavigationBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
            minHeight: `calc(${bottomNavigationBarHeight} + ${
              hideSystemBottomNavigationBar ? "0px" : systemBottomNavigationBarHeight
            })`
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
    appScreen: HTMLDivElement | null;
  }
}
