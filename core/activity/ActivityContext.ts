import { createContext, Dispatch } from "react";

import { ActivityAction, ActivityState } from "@core/activity/typing";

interface ActivityContextProps {
  state: ActivityState;
  dispatch: Dispatch<ActivityAction>;
}

const ActivityContext = createContext<ActivityContextProps>({
  state: {
    activities: []
  },
  dispatch: () => {}
});

export default ActivityContext;
