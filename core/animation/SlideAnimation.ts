import { AnimationType, BaseAnimation, AnimationPreparationStatus } from "@core/animation/typing";

class SlideAnimation implements BaseAnimation {
  name: AnimationType = "slide";
  enableBackdrop = true;

  static getPreparationStyle = (status: AnimationPreparationStatus) => {
    switch (status) {
      case "ready-to-activate":
        return {
          transform: "translate3d(0, 0, 0)"
        };
      case "ready-to-deactivate":
        return {
          transform: "translate3d(100%, 0, 0)"
        };
      default:
        return {};
    }
  };

  active = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    return {
      transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 0, 0)"
    };
  };

  inactive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    if (status === "ready-for-deactivation") {
      return {
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translate3d(100%, 0, 0)"
      };
    }

    return {
      transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateActive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
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

  immediateInactive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "none",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    if (status === "ready-for-deactivation") {
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
