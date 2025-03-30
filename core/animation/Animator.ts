import styleObjectToString from "@utils/styleObjectToString";

import styleStringToObject from "@utils/styleStringToObject";

import BreathAnimation from "@core/animation/BreathAnimation";
import FadeAnimation from "@core/animation/FadeAnimation";
import SlideAnimation from "@core/animation/SlideAnimation";
import { AnimationPreparationStatus, AnimationType, BaseAnimation } from "@core/animation/typing";

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
  readonly animationType: AnimationType;
  readonly animation: BaseAnimation;

  constructor(
    getPreviousActivityElement: () => HTMLElement | undefined,
    getCurrentActivityElement: () => HTMLElement | undefined,
    animationType: AnimationType
  ) {
    this.getPreviousActivityElement = getPreviousActivityElement;
    this.getCurrentActivityElement = getCurrentActivityElement;
    this.animationType = animationType;
    this.animation = AnimationFactory.createAnimation(animationType);
  }

  static getTransitionPreparationStyle(
    status: AnimationPreparationStatus,
    animationType?: AnimationType
  ) {
    switch (animationType) {
      case "fade":
        return FadeAnimation.getPreparationStyle(status);
      case "breath":
        return BreathAnimation.getPreparationStyle(status);
      default:
        return SlideAnimation.getPreparationStyle(status);
    }
  }

  get previousActivityElement() {
    return this.getPreviousActivityElement();
  }

  get currentActivityElement() {
    return this.getCurrentActivityElement();
  }

  activateCurrentActivityElement(animate = true, status?: AnimationPreparationStatus) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.active(status) : this.animation.immediateActive(status)
    );

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  deactivateCurrentActivityElement(animate = true, status?: AnimationPreparationStatus) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.inactive(status) : this.animation.immediateInactive(status)
    );

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  public activatePreviousActivityElement(animate = true, status?: AnimationPreparationStatus) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.active(status) : this.animation.immediateActive(status)
    );

    this.previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  deactivatePreviousActivityElement(animate = true, status?: AnimationPreparationStatus) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.inactive(status) : this.animation.immediateInactive(status)
    );

    this.previousActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  updateCurrentActivityElementProgress(value: number, clientX: number) {
    const style = this.currentActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(styleObject, this.animation.activeProgress(value, clientX));

    this.currentActivityElement?.setAttribute("style", styleObjectToString(styleObject));
  }

  updatePreviousActivityElementProgress(value: number) {
    const style = this.previousActivityElement?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");
    styleObject.display = "block";
    styleObject.transition = "none";

    Object.assign(styleObject, this.animation.inactiveProgress(value));

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
