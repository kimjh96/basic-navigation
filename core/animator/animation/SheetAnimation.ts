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
          transform: "translate3d(0, 100%, 0) scale(0.95)"
        };
      default:
        return {};
    }
  };

  active = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(0, 50px, 0) scale(0.95)"
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
        transform: "translate3d(0, 50px, 0) scale(0.95)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(0, 100%, 0) scale(0.95)"
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
        transform: "translate3d(0, 50px, 0) scale(0.95)"
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
        transform: "translate3d(0, 50px, 0) scale(0.95)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "none",
        transform: "translate3d(0, 100%, 0) scale(0.95)"
      };
    }

    return {
      transition: "none",
      transform: "translate3d(0, 100%, 0) scale(1)"
    };
  };

  activeProgress = (_: number, clientY: number) => {
    const progress = Math.min(clientY / window.innerHeight, 1);
    const scale = 1 - progress * 0.05; // 1에서 0.95까지 scale 조정

    return {
      transition: "none",
      transform: `translate3d(0, ${clientY}px, 0) scale(${scale})`
    };
  };

  inactiveProgress = (value: number) => {
    const scale = 0.95 + value * 0.05; // 0.95에서 1까지 scale 조정

    return {
      transition: "none",
      transform: `translate3d(0, ${50 - value * 50}px, 0) scale(${scale})`
    };
  };
}

export default SheetAnimation;
