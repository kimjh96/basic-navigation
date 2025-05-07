import styleObjectToString from "@utils/styleObjectToString";

import styleStringToObject from "@utils/styleStringToObject";

import BreathAnimation from "@core/animator/animation/BreathAnimation";
import FadeAnimation from "@core/animator/animation/FadeAnimation";
import FadeLeftAnimation from "@core/animator/animation/FadeLeftAnimation";
import FadeRightAnimation from "@core/animator/animation/FadeRightAnimation";
import SheetAnimation from "@core/animator/animation/SheetAnimation";
import SlideAnimation from "@core/animator/animation/SlideAnimation";
import { AnimationState, AnimationType, BaseAnimation } from "@core/animator/typing";

class AnimationFactory {
  static createAnimation(animationType: AnimationType) {
    switch (animationType) {
      case "slide":
        return new SlideAnimation();
      case "fade":
        return new FadeAnimation();
      case "fade-right":
        return new FadeRightAnimation();
      case "fade-left":
        return new FadeLeftAnimation();
      case "breath":
        return new BreathAnimation();
      case "sheet":
        return new SheetAnimation();
      default:
        return new SlideAnimation();
    }
  }
}

class Animator {
  private readonly getPrevious: () => HTMLDivElement | undefined;
  private readonly getCurrent: () => HTMLDivElement | undefined;
  readonly animationType: AnimationType;
  readonly animation: BaseAnimation;

  constructor(
    getPrevious: () => HTMLDivElement | undefined,
    getCurrent: () => HTMLDivElement | undefined,
    animationType: AnimationType
  ) {
    this.getPrevious = getPrevious;
    this.getCurrent = getCurrent;
    this.animationType = animationType;
    this.animation = AnimationFactory.createAnimation(animationType);
  }

  static getPreparationStyle(state: AnimationState, animationType?: AnimationType) {
    switch (animationType) {
      case "fade":
        return FadeAnimation.getPreparationStyle(state);
      case "fade-right":
        return FadeRightAnimation.getPreparationStyle(state);
      case "fade-left":
        return FadeLeftAnimation.getPreparationStyle(state);
      case "breath":
        return BreathAnimation.getPreparationStyle(state);
      case "sheet":
        return SheetAnimation.getPreparationStyle(state);
      default:
        return SlideAnimation.getPreparationStyle(state);
    }
  }

  get previous() {
    return this.getPrevious();
  }

  get current() {
    return this.getCurrent();
  }

  showCurrent(animate = true, state?: AnimationState) {
    const style = this.current?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.active(state) : this.animation.immediateActive(state)
    );

    this.current?.setAttribute("style", styleObjectToString(styleObject));
  }

  hideCurrent(animate = true, state?: AnimationState) {
    const style = this.current?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.inactive(state) : this.animation.immediateInactive(state)
    );

    this.current?.setAttribute("style", styleObjectToString(styleObject));
  }

  showPrevious(animate = true, state?: AnimationState) {
    const style = this.previous?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.active(state) : this.animation.immediateActive(state)
    );

    this.previous?.setAttribute("style", styleObjectToString(styleObject));
  }

  hidePrevious(animate = true, state?: AnimationState) {
    const style = this.previous?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(
      styleObject,
      animate ? this.animation.inactive(state) : this.animation.immediateInactive(state)
    );

    this.previous?.setAttribute("style", styleObjectToString(styleObject));
  }

  updateCurrentProgress(value: number, clientX: number) {
    const style = this.current?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");

    Object.assign(styleObject, this.animation.activeProgress(value, clientX));

    this.current?.setAttribute("style", styleObjectToString(styleObject));
  }

  updatePreviousProgress(value: number) {
    const style = this.previous?.getAttribute("style");
    const styleObject = styleStringToObject(style || "");
    styleObject.display = "block";
    styleObject.transition = "none";

    Object.assign(styleObject, this.animation.inactiveProgress(value));

    this.previous?.setAttribute("style", styleObjectToString(styleObject));
  }
}

export default Animator;
