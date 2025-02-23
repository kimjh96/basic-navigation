import {
  MouseEvent,
  PropsWithChildren,
  TouchEvent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import styleObjectToString from "@utils/styleObjectToString";
import styleStringToObject from "@utils/styleStringToObject";

import ActivityContext from "@core/activity/ActivityContext";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationStatus } from "@core/navigation/typing";
import TransitionContext from "@core/transition/TransitionContext";
import { TransitionActionType } from "@core/transition/typing";
import useDebounceCallback from "@hooks/useDebounceCallback";

interface SlideScreenProps {
  backgroundColor?: string;
}

function SlideScreen({ children, backgroundColor = "white" }: PropsWithChildren<SlideScreenProps>) {
  const {
    state: { currentActivity, previousActivity, waitingActivity }
  } = useContext(ActivityContext);
  const {
    state: { status }
  } = useContext(NavigationContext);
  const { dispatch } = useContext(TransitionContext);

  const [translateX, setTranslateX] = useState<string | number>(
    [NavigationStatus.READY, NavigationStatus.REPLACE_DONE].includes(status) ? 0 : "100%"
  );

  const ref = useRef<HTMLDivElement>(null);
  const isSlidingRef = useRef(false);
  const isScrollingRef = useRef(false);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const currentClientXRef = useRef(0);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isSlidingEndRef = useRef(true);
  const slidingEndTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const startSlide = ({
    clientX,
    clientY,
    scrollTop,
    previousActivityElement
  }: {
    clientX: number;
    clientY: number;
    scrollTop: number;
    previousActivityElement?: Element;
  }) => {
    if (!currentActivity?.animate) return;

    currentClientXRef.current = 0;
    startClientXRef.current = clientX;
    startClientYRef.current = clientY;
    startScrollTopRef.current = scrollTop;
    isSlidingRef.current = true;

    if (previousActivityElement) {
      const style = previousActivityElement.getAttribute("style");
      const styleObject = styleStringToObject(style || "");
      styleObject.transition = "none";
      styleObject.transform = `translate3d(-100px, 0, 0)`;

      previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
    startSlide({
      clientX: e.clientX,
      clientY: e.clientY,
      scrollTop: e.currentTarget.scrollTop,
      previousActivityElement: e.currentTarget.parentElement?.previousElementSibling || undefined
    });

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) =>
    startSlide({
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      scrollTop: e.currentTarget.scrollTop,
      previousActivityElement: e.currentTarget.parentElement?.previousElementSibling || undefined
    });

  const handleScrollEnd = useDebounceCallback(() => {
    isScrollingRef.current = false;
  }, 300);

  useEffect(() => {
    let mountDelayTimer: ReturnType<typeof setTimeout>;

    const stackRouteElement = ref.current?.parentElement;
    const activePath = stackRouteElement?.getAttribute("data-active-path");

    if (activePath === currentActivity?.activePath) {
      window.scrollContainer = ref.current;

      if (ref.current) {
        ref.current.style.transition = currentActivity?.animate ? "transform 0.3s" : "none";
      }

      mountDelayTimer = setTimeout(
        () => {
          const previousActivityElement = stackRouteElement?.previousElementSibling;

          if (previousActivityElement) {
            if (previousActivityElement.lastElementChild) {
              previousActivityElement.lastElementChild.scrollTop =
                window.history.state?.scrollTop || 0;
            }

            const style = previousActivityElement.getAttribute("style");
            const styleObject = styleStringToObject(style || "");
            styleObject.transition = currentActivity?.animate ? "transform 0.3s" : "none";
            styleObject.transform = `translate3d(-100px, 0, 0)`;

            previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
          }

          setTranslateX(0);
        },
        currentActivity?.animate ? 50 : 0
      );
    }

    return () => {
      if (mountDelayTimer) {
        clearTimeout(mountDelayTimer);
      }
    };
  }, [currentActivity?.activePath, currentActivity?.animate]);

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
        styleObject.transition = waitingActivity?.animate ? "transform 0.3s" : "none";
        styleObject.transform = `translate3d(0, 0, 0)`;

        previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
      }

      setTranslateX("100%");
    }
  }, [waitingActivity?.activePath, waitingActivity?.animate, translateX]);

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

    const sliding = ({
      e,
      clientX,
      clientY,
      currentActivityElement
    }: {
      e: globalThis.MouseEvent | globalThis.TouchEvent;
      clientX: number;
      clientY: number;
      currentActivityElement: HTMLDivElement;
    }) => {
      if (!isSlidingRef.current || isScrollingRef.current) return;

      const previousActivityElement = currentActivityElement.parentElement?.previousElementSibling;

      currentClientXRef.current = clientX - startClientXRef.current;

      const deltaY = Math.abs(clientY - startClientYRef.current);
      const deltaX = Math.abs(currentClientXRef.current);
      const notYet = deltaY > deltaX || currentClientXRef.current < 0;

      if (notYet) {
        const style = previousActivityElement?.getAttribute("style");
        const styleObject = styleStringToObject(style || "");

        previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
        currentActivityElement.style.transition = "transform 0.3s";
        currentActivityElement.style.transform = "translate3d(0, 0, 0)";
        currentClientXRef.current = 1; // 클릭 이벤트 전파 방지

        isSlidingRef.current = false;
        return;
      }

      if (previousActivityElement) {
        dispatch({
          type: TransitionActionType.PENDING
        });

        const progress = deltaX / window.innerWidth;
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        const clampedProgressPercentage = Math.min(Math.max(progress, 0), 1) * 100;

        backdropRef.current!.style.transition = "none";
        backdropRef.current!.style.opacity = `${1 - clampedProgress}`;

        const style = previousActivityElement.getAttribute("style");
        const styleObject = styleStringToObject(style || "");
        styleObject.display = "block";
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

    const handleMouseMove = (e: globalThis.MouseEvent) =>
      sliding({
        e,
        clientX: e.clientX,
        clientY: e.clientY,
        currentActivityElement: e.currentTarget as HTMLDivElement
      });

    const handleTouchMove = (e: globalThis.TouchEvent) =>
      sliding({
        e,
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        currentActivityElement: e.currentTarget as HTMLDivElement
      });

    currentActivityElement?.addEventListener("mousemove", handleMouseMove);
    currentActivityElement?.addEventListener("touchmove", handleTouchMove);

    return () => {
      currentActivityElement?.removeEventListener("mousemove", handleMouseMove);
      currentActivityElement?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dispatch]);

  useEffect(() => {
    const currentActivityElement = ref.current;

    const endSlide = ({ currentActivityElement }: { currentActivityElement: HTMLDivElement }) => {
      if (!currentActivity?.animate) return;

      isSlidingRef.current = false;
      isSlidingEndRef.current = false;

      const previousActivityElement = currentActivityElement.parentElement?.previousElementSibling;
      const isTriggered = currentClientXRef.current >= 30;

      currentActivityElement.style.transition = "transform 0.3s";
      backdropRef.current!.style.transition = "opacity 0.3s";

      if (isTriggered) {
        if (previousActivityElement) {
          const style = previousActivityElement.getAttribute("style");
          const styleObject = styleStringToObject(style || "");
          styleObject.transition = "transform 0.3s";
          styleObject.transform = `translate3d(0, 0, 0)`;

          previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
        }

        currentActivityElement.style.transform = "translate3d(100%, 0, 0)";

        window.history.back();
      } else {
        if (previousActivityElement) {
          const style = previousActivityElement.getAttribute("style");
          const styleObject = styleStringToObject(style || "");
          styleObject.transition = "transform 0.3s";
          styleObject.transform = `translate3d(-100px, 0, 0)`;

          previousActivityElement.setAttribute("style", styleObjectToString(styleObject));
        }

        currentActivityElement.style.transform = "translate3d(0, 0, 0)";
      }

      if (slidingEndTimerRef.current) {
        clearTimeout(slidingEndTimerRef.current);
      }

      slidingEndTimerRef.current = setTimeout(() => {
        isSlidingEndRef.current = true;
        dispatch({
          type: TransitionActionType.DONE
        });
      }, 300);
    };

    const handleMouseUp = (e: globalThis.MouseEvent) =>
      endSlide({
        currentActivityElement: e.currentTarget as HTMLDivElement
      });

    const handleTouchEnd = (e: globalThis.TouchEvent) =>
      endSlide({
        currentActivityElement: e.currentTarget as HTMLDivElement
      });

    currentActivityElement?.addEventListener("mouseup", handleMouseUp);
    currentActivityElement?.addEventListener("touchend", handleTouchEnd);

    return () => {
      currentActivityElement?.removeEventListener("mouseup", handleMouseUp);
      currentActivityElement?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentActivity?.animate, dispatch]);

  useEffect(() => {
    const currentActivityElement = ref.current;

    const handleClick = (e: globalThis.MouseEvent) => {
      if (!isSlidingEndRef.current && currentClientXRef.current >= 1) {
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
          opacity: currentActivity?.animate && !translateX ? 1 : 0,
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          width: "100%",
          height: "100%",
          transform: `translate3d(${translateX}, 0, 0)`,
          overflow: "auto",
          overscrollBehavior: "none",
          backgroundColor
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
    scrollContainer: HTMLDivElement | null;
  }
}
