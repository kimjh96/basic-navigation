import { AnimationType, AnimationStatus, BaseAnimation } from "@core/animation/typing";

class SlideAnimation implements BaseAnimation {
  name: AnimationType = "slide";
  enableBackdrop = true;

  active = (status?: AnimationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "transform 0.3s",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    return {
      transition: "transform 0.3s",
      transform: "translate3d(0, 0, 0)"
    };
  };

  inactive = (status?: AnimationStatus) => {
    if (status === "ready-for-activation") {
      return {
        transition: "transform 0.3s",
        transform: "translate3d(-100px, 0, 0)"
      };
    }

    if (status === "ready-for-deactivation") {
      return {
        transition: "transform 0.3s",
        transform: "translate3d(100%, 0, 0)"
      };
    }

    return {
      transition: "transform 0.3s",
      transform: "translate3d(0, 0, 0)"
    };
  };

  immediateActive = (status?: AnimationStatus) => {
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

  immediateInactive = (status?: AnimationStatus) => {
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
