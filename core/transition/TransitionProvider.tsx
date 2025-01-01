import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { ActivityActionType } from "@core/activity/typing";
import HistoryContext from "@core/history/HistoryContext";
import { History, HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationStatus } from "@core/navigation/typing";

function TransitionProvider({ children }: PropsWithChildren) {
  const {
    state: { records },
    dispatch
  } = useContext(HistoryContext);
  const { dispatch: activityDispatch } = useContext(ActivityContext);
  const {
    state: { events },
    dispatch: navigationDispatch
  } = useContext(NavigationContext);

  const [transitionBuffer, setTransitionBuffer] = useState<
    Array<{
      id: string;
      flush: (records: History["records"]) => Promise<boolean>;
    }>
  >([]);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isFlushingRef = useRef(false);

  useEffect(() => {
    for (const event of events) {
      if (event.status === NavigationStatus.PUSH) {
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params
        });
        navigationDispatch({
          type: NavigationActionType.DONE
        });
        dispatch({ type: HistoryActionType.PUSH, path: event.path, params: event.params });
      } else if (event.status === NavigationStatus.STACK_PUSH) {
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params
        });
        navigationDispatch({
          type: NavigationActionType.DONE
        });
        dispatch({ type: HistoryActionType.STACK_PUSH, path: event.path, params: event.params });
      } else if (event.status === NavigationStatus.POP) {
        setTransitionBuffer((prevState) => {
          const buffer = prevState.find((item) => item.id === `${event.path}-${event.status}`);

          if (buffer) {
            return prevState.filter((prevBuffer) => prevBuffer.id !== buffer.id);
          }

          const flush = (records: History["records"]) =>
            new Promise<boolean>((resolve) => {
              const lastRecord = records[records.length - 1];

              if (lastRecord.type !== HistoryActionType.STACK_PUSH) {
                activityDispatch({
                  type: ActivityActionType.UPDATE_WAITING_ACTIVITY
                });
              }

              transitionTimerRef.current = setTimeout(() => {
                const { path, params } =
                  records[records.length - 3] || records[records.length - 2] || lastRecord;

                activityDispatch({
                  type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY,
                  path,
                  params
                });
                navigationDispatch({
                  type: NavigationActionType.DONE
                });
                dispatch({ type: HistoryActionType.POP });
                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id: `${event.path}-${event.status}`,
            flush
          });
        });
      }
    }
  }, [events, activityDispatch, navigationDispatch, dispatch]);

  useEffect(() => {
    if (transitionBuffer.length === 0 || isFlushingRef.current) return;

    (async () => {
      for (const { flush } of transitionBuffer) {
        isFlushingRef.current = true;

        const isFlushed = await flush(records);

        if (isFlushed) {
          setTransitionBuffer((prevState) => prevState.slice(0, prevState.length - 1));
          isFlushingRef.current = false;
        }
      }
    })();
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
