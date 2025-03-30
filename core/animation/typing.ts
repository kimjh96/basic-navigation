export type AnimationType = "slide" | "fade" | "breath";
export type AnimationPreparationStatus =
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
  active: (status?: AnimationPreparationStatus) => StyleObject;
  inactive: (status?: AnimationPreparationStatus) => StyleObject;
  immediateActive: (status?: AnimationPreparationStatus) => StyleObject;
  immediateInactive: (status?: AnimationPreparationStatus) => StyleObject;
  activeProgress: (value: number, clientX: number) => StyleObject;
  inactiveProgress: (value: number) => StyleObject;
}
