import { AnimationType, BaseAnimation, AnimationState } from "@core/animator/typing";

class SlideAnimation implements BaseAnimation {
  name: AnimationType = "slide";
  enableBackdrop = true;

  static getPreparationStyle = (state: AnimationState) => {
    switch (state) {
      case "active-initial":
        return {
          transform: "translate3d(0, 0, 0)"
        };
      case "inactive-initial":
        return {
          transform: "translate3d(100%, 0, 0)"
        };
      default:
        return {};
    }
  };

  active = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    return {
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 0, 0)"
    };
  };

  inactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(100%, 0, 0)"
      };
    }

    return {
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateActive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    return {
      transition: "none",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateInactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "none",
        transform: "translate3d(100%, 0, 0)"
      };
    }

    return {
      transition: "none",
      transform: "translate3d(0, 0, 0)"
    };
  };

  activeProgress = (_: number, clientX: number) => ({
    transition: "none",
    transform: `translate3d(${clientX}px, 0, 0)`
  });

  inactiveProgress = (value: number) => ({
    transition: "none",
    transform: `translate3d(calc(-100px + ${value * 100}px), 0, 0)`
  });
}

export default SlideAnimation;
