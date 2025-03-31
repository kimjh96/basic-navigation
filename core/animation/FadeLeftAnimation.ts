import { AnimationPreparationStatus, AnimationType, BaseAnimation } from "@core/animation/typing";

class FadeLeftAnimation implements BaseAnimation {
  name: AnimationType = "fade-left";
  enableBackdrop = false;

  static getPreparationStyle = (status: AnimationPreparationStatus) => {
    switch (status) {
      case "ready-to-activate":
        return {
          opacity: "1",
          transform: "translate3d(0, 0, 0)"
        };
      case "ready-to-deactivate":
        return {
          opacity: "0",
          transform: "translate3d(-20px, 0, 0)"
        };
      default:
        return {};
    }
  };

  active = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition:
          "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(20px, 0, 0)"
      };
    }

    return {
      transition:
        "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  inactive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition:
          "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(20px, 0, 0)"
      };
    }

    if (status === "ready-for-deactivation") {
      return {
        transition:
          "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: "0",
        transform: "translate3d(-20px, 0, 0)"
      };
    }

    return {
      transition:
        "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: "1",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateActive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
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

  immediateInactive = (status?: AnimationPreparationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "none",
        opacity: "0",
        transform: "translate3d(20px, 0, 0)"
      };
    }

    if (status === "ready-for-deactivation") {
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

  activeProgress = (_: number, clientX: number) => {
    const slideProgress = Math.min(clientX * 0.2, 20);
    const opacityProgress = Math.max(0, (slideProgress - 5) / 15);

    return {
      transition: "none",
      opacity: `${1 - opacityProgress}`,
      transform: `translate3d(${-slideProgress}px, 0, 0)`
    };
  };

  inactiveProgress = (value: number) => {
    const slideProgress = Math.min(value * 20, 20);
    const opacityProgress = Math.max(0, (slideProgress - 2) / 18);

    return {
      transition: "none",
      opacity: `${opacityProgress}`,
      transform: `translate3d(calc(20px - ${slideProgress}px), 0, 0)`
    };
  };
}

export default FadeLeftAnimation;
