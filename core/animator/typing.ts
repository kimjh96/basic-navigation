export type AnimationType = "slide" | "fade" | "breath" | "fade-right" | "fade-left" | "sheet";
export type AnimationState =
  | "preparing-active"
  | "preparing-inactive"
  | "active-initial"
  | "inactive-initial";
export type SwipeBackDirection = "horizontal" | "vertical";

interface StyleObject {
  transition: string;
  [key: string]: string;
}

export interface BaseAnimation {
  name: AnimationType;
  enableBackdrop: boolean;
  swipeBackDirection: SwipeBackDirection;
  active: (state?: AnimationState) => StyleObject;
  inactive: (state?: AnimationState) => StyleObject;
  immediateActive: (state?: AnimationState) => StyleObject;
  immediateInactive: (state?: AnimationState) => StyleObject;
  activeProgress: (value: number, clientX: number) => StyleObject;
  inactiveProgress: (value: number) => StyleObject;
}
