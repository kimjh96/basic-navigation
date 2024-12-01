import { useContext } from "react";

import ActivityContext from "@core/activity/ActivityContext";

export default function useActivity() {
  return useContext(ActivityContext).state.currentActivity;
}
