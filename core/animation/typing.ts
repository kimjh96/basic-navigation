export type AnimationType = "slide" | "fade" | "breath";
export type AnimationStatus =
  | "ready-for-activation"
  | "ready-for-deactivation"
  | "ready-to-activate"
  | "ready-to-deactivate";

interface StyleObject {
  transition: string;
  [key: string]: string;
}

export interface BaseAnimation {
  name: AnimationType;
  enableBackdrop: boolean;
  active: (status?: AnimationStatus) => StyleObject;
  inactive: (status?: AnimationStatus) => StyleObject;
  immediateActive: (status?: AnimationStatus) => StyleObject;
  immediateInactive: (status?: AnimationStatus) => StyleObject;
  activeProgress: (value: number, clientX: number) => StyleObject;
  inactiveProgress: (value: number) => StyleObject;
}
