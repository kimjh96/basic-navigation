import { TouchEvent, PropsWithChildren, useEffect, useState, useRef, useContext } from "react";

import styleObjectToString from "@utils/styleObjectToString";
import styleStringToObject from "@utils/styleStringToObject";

import ActivityContext from "@core/activity/ActivityContext";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationStatus } from "@core/navigation/typing";
import useDebounceCallback from "@hooks/useDebounceCallback";

function SlideScreen({ children }: PropsWithChildren) {
  const {
    state: { currentActivity, previousActivity, waitingActivity }
  } = useContext(ActivityContext);
  const {
    state: { status }
  } = useContext(NavigationContext);

  const [translateX, setTranslateX] = useState<string | number>(
    status === NavigationStatus.READY ? 0 : "100%"
  );

  const ref = useRef<HTMLDivElement>(null);
  const isSlidingRef = useRef(false);
  const isScrollingRef = useRef(false);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const currentClientXRef = useRef(0);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    currentClientXRef.current = 0;
    startClientXRef.current = e.touches[0].clientX;
    startClientYRef.current = e.touches[0].clientY;
    startScrollTopRef.current = e.currentTarget.scrollTop;
    isSlidingRef.current = true;

    const previousActivityElement = e.currentTarget.parentElement?.previousElementSibling;

    if (previousActivityElement) {
      const style = previousActivityElement.getAttribute("style");
      const styleObject = styleStringToObject(style || "");
      styleObject.transition = "none";
      styleObject.transform = `translate3d(-100px, 0, 0)`;

      previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const isTriggered = currentClientXRef.current >= 30;
    const previousActivityElement = e.currentTarget.parentElement?.previousElementSibling;

    e.currentTarget.style.transition = "transform 0.3s";
    backdropRef.current!.style.transition = "opacity 0.3s";

    if (isTriggered) {
      if (previousActivityElement) {
        const style = previousActivityElement.getAttribute("style");
        const styleObject = styleStringToObject(style || "");
        styleObject.transition = "transform 0.3s";
        styleObject.transform = `translate3d(0, 0, 0)`;

        previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
      }

      e.currentTarget.style.transform = "translate3d(100%, 0, 0)";
      window.history.back();
    } else {
      if (previousActivityElement) {
        const style = previousActivityElement.getAttribute("style");
        const styleObject = styleStringToObject(style || "");
        styleObject.transition = "transform 0.3s";
        styleObject.transform = `translate3d(-100px, 0, 0)`;

        previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
      }

      e.currentTarget.style.transform = "translate3d(0, 0, 0)";
    }

    isSlidingRef.current = false;
  };

  const handleScrollEnd = useDebounceCallback(() => {
    isScrollingRef.current = false;
  }, 300);

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

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!isSlidingRef.current || isScrollingRef.current) return;

      const currentActivityElement = e.currentTarget as HTMLElement;
      const previousActivityElement = currentActivityElement.parentElement?.previousElementSibling;

      currentClientXRef.current = e.touches[0].clientX - startClientXRef.current;

      const deltaY = Math.abs(e.touches[0].clientY - startClientYRef.current);
      const deltaX = Math.abs(currentClientXRef.current);
      const notYet = deltaY > deltaX || currentClientXRef.current < 0;

      if (notYet) {
        const style = previousActivityElement?.getAttribute("style");
        const styleObject = styleStringToObject(style || "");

        styleObject.transform = `translate3d(-100px, 0, 0)`;

        previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
        currentActivityElement.style.transition = "transform 0.3s";
        currentActivityElement.style.transform = "translate3d(0, 0, 0)";
        currentClientXRef.current = 0;
        isSlidingRef.current = false;
        return;
      }

      if (previousActivityElement) {
        const progress = deltaX / window.innerWidth;
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        const clampedProgressPercentage = Math.min(Math.max(progress, 0), 1) * 100;

        backdropRef.current!.style.transition = "none";
        backdropRef.current!.style.opacity = `${1 - clampedProgress}`;

        const style = previousActivityElement.getAttribute("style");
        const styleObject = styleStringToObject(style || "");
        styleObject.transition = "none";
        styleObject.transform = `translate3d(calc(-100px + ${clampedProgressPercentage}px), 0, 0)`;

        previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
      }

      currentActivityElement.style.transition = "none";
      currentActivityElement.style.transform = `translate3d(${currentClientXRef.current}px, 0, 0)`;

      const targetElement = e.target as HTMLElement;

      if (targetElement.id === "activity-bar" || e.cancelable) {
        e.preventDefault();
      }
    };

    currentActivityElement?.addEventListener("touchmove", handleTouchMove);

    return () => {
      currentActivityElement?.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    let mountDelayTimer: ReturnType<typeof setTimeout>;

    const stackRouteElement = ref.current?.parentElement;
    const activePath = stackRouteElement?.getAttribute("data-active-path");

    if (activePath === currentActivity?.activePath) {
      window.currentScreen = ref.current;

      if (ref.current) {
        ref.current.style.transition = "transform 0.3s";
      }

      mountDelayTimer = setTimeout(() => {
        const previousActivityElement = stackRouteElement?.previousElementSibling;

        if (previousActivityElement) {
          previousActivityElement.lastElementChild!.scrollTop =
            window.history.state?.scrollTop || 0;

          const style = previousActivityElement.getAttribute("style");
          const styleObject = styleStringToObject(style || "");
          styleObject.transition = "transform 0.3s";
          styleObject.transform = `translate3d(-100px, 0, 0)`;

          previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
        }

        setTranslateX(0);
      }, 50);
    }

    return () => {
      if (mountDelayTimer) {
        clearTimeout(mountDelayTimer);
      }
    };
  }, [currentActivity?.activePath]);

  useEffect(() => {
    const stackRouteElement = ref.current?.parentElement;
    const activePath = stackRouteElement?.getAttribute("data-active-path");

    if (activePath === previousActivity?.activePath) {
      setTranslateX(0);
    }
  }, [previousActivity?.activePath]);

  useEffect(() => {
    const stackRouteElement = ref.current?.parentElement;
    const activePath = stackRouteElement?.getAttribute("data-active-path");

    if (activePath === waitingActivity?.activePath && !translateX) {
      const previousActivityElement = stackRouteElement?.previousElementSibling;

      if (previousActivityElement) {
        const style = previousActivityElement.getAttribute("style");
        const styleObject = styleStringToObject(style || "");
        styleObject.transition = "transform 0.3s";
        styleObject.transform = `translate3d(0, 0, 0)`;

        previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
      }

      setTranslateX("100%");
    }
  }, [waitingActivity?.activePath, translateX]);

  return (
    <>
      <div
        id={"activity-bar"}
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
          opacity: !translateX ? 1 : 0,
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "100%",
          height: "100%",
          transform: `translate3d(${translateX}, 0, 0)`,
          overflow: "auto",
          overscrollBehavior: "none",
          backgroundColor: "white"
        }}
      >
        {children}
      </div>
    </>
  );
}

export default SlideScreen;

declare global {
  interface Window {
    currentScreen: HTMLDivElement | null;
  }
}
