import {
  AnimationState,
  AnimationType,
  BaseAnimation,
  SwipeBackDirection
} from "@core/animator/typing";

class SheetAnimation implements BaseAnimation {
  name: AnimationType = "sheet";
  swipeBackDirection: SwipeBackDirection = "vertical";
  enableBackdrop = true;

  static getPreparationStyle = (state: AnimationState) => {
    switch (state) {
      case "active-initial":
        return {
          transform: "translate3d(0, 0, 0) scale(1)"
        };
      case "inactive-initial":
        return {
          transform: "translate3d(0, 100%, 0) scale(0.97)"
        };
      default:
        return {};
    }
  };

  active = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(0, 25px, 0) scale(0.97)"
      };
    }

    return {
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 0, 0) scale(1)"
    };
  };

  inactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(0, 25px, 0) scale(0.97)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(0, 100%, 0) scale(0.97)"
      };
    }

    return {
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 100%, 0) scale(1)"
    };
  };

  immediateActive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        transform: "translate3d(0, 25px, 0) scale(0.97)"
      };
    }

    return {
      transition: "none",
      transform: "translate3d(0, 0, 0) scale(1)"
    };
  };

  immediateInactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        transform: "translate3d(0, 25px, 0) scale(0.97)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "none",
        transform: "translate3d(0, 100%, 0) scale(0.97)"
      };
    }

    return {
      transition: "none",
      transform: "translate3d(0, 100%, 0) scale(1)"
    };
  };

  activeProgress = (_: number, clientY: number) => {
    const progress = Math.min(clientY / window.innerHeight, 1);
    const scale = 1 - progress * 0.03; // 1에서 0.97까지 scale 조정

    return {
      transition: "none",
      transform: `translate3d(0, ${clientY}px, 0) scale(${scale})`
    };
  };

  inactiveProgress = (value: number) => {
    const scale = 0.97 + value * 0.03; // 0.97에서 1까지 scale 조정

    return {
      transition: "none",
      transform: `translate3d(0, ${25 - value * 25}px, 0) scale(${scale})`
    };
  };
}

export default SheetAnimation;
