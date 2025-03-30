import styleObjectToString from "@utils/styleObjectToString";

import styleStringToObject from "@utils/styleStringToObject";

import BreathAnimation from "@core/animation/BreathAnimation";
import FadeAnimation from "@core/animation/FadeAnimation";
import SlideAnimation from "@core/animation/SlideAnimation";
import { AnimationStatus, AnimationType, BaseAnimation } from "@core/animation/typing";

class AnimationFactory {
  static createAnimation(animationType: AnimationType) {
    switch (animationType) {
      case "slide":
        return new SlideAnimation();
      case "fade":
        return new FadeAnimation();
      case "breath":
        return new BreathAnimation();
      default:
        return new SlideAnimation();
    }
  }
}

class Animator {
  private readonly getPreviousActivityElement: () => HTMLElement | undefined;
  private readonly getCurrentActivityElement: () => HTMLElement | undefined;
  readonly animation: AnimationType;
  readonly animationSet: BaseAnimation;

  constructor(
    getPreviousActivityElement: () => HTMLElement | undefined,
    getCurrentActivityElement: () => HTMLElement | undefined,
    animation: AnimationType
  ) {
    this.getPreviousActivityElement = getPreviousActivityElement;
    this.getCurrentActivityElement = getCurrentActivityElement;
    this.animation = animation;
    this.animationSet = AnimationFactory.createAnimation(animation);
  }

  get previousActivityElement() {
    return this.getPreviousActivityElement();
  }

  get currentActivityElement() {
    return this.getCurrentActivityElement();
  }

  static getTransitionPreparationStyle(statusWithType: `${AnimationStatus}-${AnimationType}`) {
    switch (statusWithType) {
      case "ready-to-activate-fade":
        return {
          opacity: 1
        };
      case "ready-to-deactivate-fade":
        return {
          opacity: 0
        };
      case "ready-to-activate-slide":
        return {
          transform: "translate3d(0, 0, 0)"
        };
      case "ready-to-deactivate-slide":
        return {
          transform: "translate3d(100%, 0, 0)"
        };
      case "ready-to-activate-breath":
        return {
          opacity: 1,
          transform: "scale(1)"
        };
      case "ready-to-deactivate-breath":
        return {
          opacity: 0,
          transform: "scale(0.985)"
        };
      default:
        return {};
    }
  }

  activateCurrentActivityElement(animate = true, status?: AnimationStatus) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animationSet.active(status) : this.animationSet.immediateActive(status)
    );

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  deactivateCurrentActivityElement(animate = true, status?: AnimationStatus) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animationSet.inactive(status) : this.animationSet.immediateInactive(status)
    );

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  public activatePreviousActivityElement(animate = true, status?: AnimationStatus) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animationSet.active(status) : this.animationSet.immediateActive(status)
    );

    this.previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  deactivatePreviousActivityElement(animate = true, status?: AnimationStatus) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animationSet.inactive(status) : this.animationSet.immediateInactive(status)
    );

    this.previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  updateCurrentActivityElementProgress(value: number, clientX: number) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(styleObject, this.animationSet.activeProgress(value, clientX));

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  updatePreviousActivityElementProgress(value: number) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");
    styleObject.display = "block";
    styleObject.transition = "none";

    Object.assign(styleObject, this.animationSet.inactiveProgress(value));

    this.previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  restoreCurrentActivityElementScroll() {
    if (this.currentActivityElement?.lastElementChild) {
      this.currentActivityElement.lastElementChild?.scrollTo({
        top: window.history.state?.scrollTop || 0
      });
    }
  }
}

export default Animator;
