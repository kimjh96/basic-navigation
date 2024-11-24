import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { ActivityActionType } from "@core/activity/typing";
import HistoryContext from "@core/history/HistoryContext";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationStatus } from "@core/navigation/typing";

function TransitionProvider({ children }: PropsWithChildren) {
  const {
    state: { records }
  } = useContext(HistoryContext);
  const { dispatch: activityDispatch } = useContext(ActivityContext);
  const {
    state: { events },
    dispatch: navigationDispatch
  } = useContext(NavigationContext);

  const [transitionBuffer, setTransitionBuffer] = useState<
    Array<{
      id: string;
      flush: (records: string[]) => Promise<boolean>;
    }>
  >([]);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isFlushingRef = useRef(false);

  useEffect(() => {
    events.forEach((event) => {
      if (event.status === NavigationStatus.PUSH) {
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY_BY_PATHNAME,
          path: event.path
        });
        navigationDispatch({
          type: NavigationActionType.DONE
        });
      } else if (event.status === NavigationStatus.POP) {
        activityDispatch({
          type: ActivityActionType.UPDATE_WAITING_ACTIVITY_BY_PATHNAME
        });

        setTransitionBuffer((prevState) => {
          const hasId = prevState.find((item) => item.id === `${event.path}-${event.status}`);

          if (hasId) {
            return prevState;
          }

          const flush = (records: string[]) =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current = setTimeout(() => {
                const previousPath = records[records.length - 2] || records[records.length - 1];

                activityDispatch({
                  type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY_BY_PATHNAME,
                  path: previousPath
                });
                navigationDispatch({
                  type: NavigationActionType.DONE
                });
                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id: `${event.path}-${event.status}`,
            flush
          });
        });
      }
    });
  }, [events, activityDispatch, navigationDispatch]);

  useEffect(() => {
    if (transitionBuffer.length === 0 || isFlushingRef.current) return;

    transitionBuffer.forEach(async ({ flush }) => {
      isFlushingRef.current = true;

      const isFlushed = await flush(records);

      if (isFlushed) {
        setTransitionBuffer((prevState) => prevState.slice(0, prevState.length - 1));
        isFlushingRef.current = false;
      }
    });
  }, [transitionBuffer, records]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return children;
}

export default TransitionProvider;
