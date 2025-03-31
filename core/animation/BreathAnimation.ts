import { AnimationPreparationStatus, AnimationType, BaseAnimation } from "@core/animation/typing";

class BreathAnimation implements BaseAnimation {
  name: AnimationType = "breath";
  enableBackdrop = false;

  static getPreparationStyle = (status: AnimationPreparationStatus) => {
    switch (status) {
      case "ready-to-activate":
        return {
          opacity: "1",
          transform: "scale(1)"
        };
      case "ready-to-deactivate":
        return {
          opacity: "0",
          transform: "scale(0.985)"
        };
      default:
        return {};
    }
  };

  active = () => ({
    transition:
      "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "1",
    transform: "scale(1)"
  });

  inactive = () => ({
    transition:
      "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "0",
    transform: "scale(0.985)"
  });

  immediateActive = () => ({
    transition: "none",
    opacity: "1",
    transform: "scale(1)"
  });

  immediateInactive = () => ({
    transition: "none",
    opacity: "0",
    transform: "scale(0.985)"
  });

  activeProgress = (value: number) => ({
    transition: "none",
    opacity: `${1 - value}`,
    transform: `scale(${1 - value * 0.015})`
  });

  inactiveProgress = (value: number) => ({
    transition: "none",
    opacity: `${value}`,
    transform: `scale(${0.985 + value * 0.015})`
  });
}

export default BreathAnimation;
