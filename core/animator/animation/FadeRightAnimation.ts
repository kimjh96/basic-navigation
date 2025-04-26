import { AnimationState, AnimationType, BaseAnimation } from "@core/animator/typing";

class FadeRightAnimation implements BaseAnimation {
  name: AnimationType = "fade-right";
  enableBackdrop = false;

  static getPreparationStyle = (state: AnimationState) => {
    switch (state) {
      case "active-initial":
        return {
          opacity: "1",
          transform: "translate3d(0, 0, 0)"
        };
      case "inactive-initial":
        return {
          opacity: "0",
          transform: "translate3d(20px, 0, 0)"
        };
      default:
        return {};
    }
  };

  active = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition:
          "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(-20px, 0, 0)"
      };
    }

    return {
      transition:
        "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  inactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition:
          "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(-20px, 0, 0)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition:
          "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(20px, 0, 0)"
      };
    }

    return {
      transition:
        "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateActive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        opacity: "0",
        transform: "translate3d(-20px, 0, 0)"
      };
    }

    return {
      transition: "none",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateInactive = (state?: AnimationState) => {
    if (state === "preparing-active") {
      return {
        transition: "none",
        opacity: "0",
        transform: "translate3d(-20px, 0, 0)"
      };
    }

    if (state === "preparing-inactive") {
      return {
        transition: "none",
        opacity: "0",
        transform: "translate3d(20px, 0, 0)"
      };
    }

    return {
      transition: "none",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  activeProgress = (_: number, clientX: number) => {
    const slideProgress = Math.min(clientX * 0.2, 20);
    const opacityProgress = Math.max(0, (slideProgress - 5) / 15);

    return {
      transition: "none",
      opacity: `${1 - opacityProgress}`,
      transform: `translate3d(${slideProgress}px, 0, 0)`
    };
  };

  inactiveProgress = (value: number) => {
    const slideProgress = Math.min(value * 20, 20);
    const opacityProgress = Math.max(0, (slideProgress - 2) / 18);
    return {
      transition: "none",
      opacity: `${opacityProgress}`,
      transform: `translate3d(calc(-20px + ${slideProgress}px), 0, 0)`
    };
  };
}

export default FadeRightAnimation;
