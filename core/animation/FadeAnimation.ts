import { AnimationPreparationStatus, AnimationType, BaseAnimation } from "@core/animation/typing";

class FadeAnimation implements BaseAnimation {
  name: AnimationType = "fade";
  enableBackdrop = false;

  static getPreparationStyle = (status: AnimationPreparationStatus) => {
    switch (status) {
      case "ready-to-activate":
        return {
          opacity: "1"
        };
      case "ready-to-deactivate":
        return {
          opacity: "0"
        };
      default:
        return {};
    }
  };

  active = () => ({
    transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "1"
  });

  inactive = () => ({
    transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "0"
  });

  immediateActive = () => ({
    transition: "none",
    opacity: "1"
  });

  immediateInactive = () => ({
    transition: "none",
    opacity: "0"
  });

  activeProgress = (value: number) => ({
    transition: "none",
    opacity: `${1 - value}`
  });

  inactiveProgress = (value: number) => ({
    transition: "none",
    opacity: `${value}`
  });
}

export default FadeAnimation;
