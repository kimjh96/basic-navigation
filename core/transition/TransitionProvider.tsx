import { PropsWithChildren, useContext, useEffect, useReducer, useRef, useState } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { ActivityActionType } from "@core/activity/typing";
import HistoryContext from "@core/history/HistoryContext";
import { History, HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationStatus } from "@core/navigation/typing";
import { transitionReducer } from "@core/transition/store";
import TransitionContext from "@core/transition/TransitionContext";
import { TransitionStatus } from "@core/transition/typing";

function TransitionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(transitionReducer, {
    status: TransitionStatus.DONE
  });
  const {
    state: { records },
    dispatch: historyDispatch
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

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isFlushingRef = useRef(false);

  useEffect(() => {
    if (isFlushingRef.current) {
      return;
    }

    for (const event of events) {
      const id = `${event.path}-${event.status}-${event.recordedAt}`;

      if (event.status === NavigationStatus.PUSH) {
        navigationDispatch({
          type: NavigationActionType.PUSH_NAVIGATING
        });
        historyDispatch({
          type: HistoryActionType.PUSH,
          path: event.path,
          params: event.params,
          animate: event.animate
        });
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params,
          animate: event.animate
        });

        setTransitionBuffer((prevState) => {
          if (isFlushingRef.current) {
            return prevState.filter((prevBuffer) => prevBuffer.id !== id);
          }

          isFlushingRef.current = true;

          const flush = () =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current = setTimeout(() => {
                navigationDispatch({
                  type: NavigationActionType.PUSH_DONE
                });

                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id,
            flush
          });
        });
      } else if (event.status === NavigationStatus.STACK_PUSH) {
        navigationDispatch({
          type: NavigationActionType.STACK_PUSH_NAVIGATING
        });
        historyDispatch({
          type: HistoryActionType.STACK_PUSH,
          path: event.path,
          params: event.params,
          animate: event.animate
        });
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params,
          animate: event.animate
        });

        setTransitionBuffer((prevState) => {
          if (isFlushingRef.current) {
            return prevState.filter((prevBuffer) => prevBuffer.id !== id);
          }

          isFlushingRef.current = true;

          const flush = () =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current = setTimeout(() => {
                navigationDispatch({
                  type: NavigationActionType.STACK_PUSH_DONE
                });

                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id,
            flush
          });
        });
      } else if (event.status === NavigationStatus.REPLACE) {
        navigationDispatch({
          type: NavigationActionType.REPLACE_NAVIGATING
        });
        historyDispatch({
          type: HistoryActionType.PUSH,
          path: event.path,
          params: event.params,
          animate: event.animate
        });
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params,
          animate: event.animate
        });

        setTransitionBuffer((prevState) => {
          if (isFlushingRef.current) {
            return prevState.filter((prevBuffer) => prevBuffer.id !== id);
          }

          isFlushingRef.current = true;

          const flush = (records: History["records"]) =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current = setTimeout(() => {
                const { path, params } =
                  records[records.length - 3] ||
                  records[records.length - 2] ||
                  records[records.length - 1];

                activityDispatch({
                  type: ActivityActionType.UPDATE_SPECIFY_PREVIOUS_ACTIVITY,
                  path,
                  params
                });
                navigationDispatch({
                  type: NavigationActionType.REPLACE_DONE
                });
                historyDispatch({
                  type: HistoryActionType.REPLACE,
                  path: event.path,
                  params: event.params,
                  animate: event.animate
                });

                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id,
            flush
          });
        });
      } else if (event.status === NavigationStatus.BACK) {
        navigationDispatch({
          type: NavigationActionType.BACK_NAVIGATING
        });

        setTransitionBuffer((prevState) => {
          if (isFlushingRef.current) {
            return prevState.filter((prevBuffer) => prevBuffer.id !== id);
          }

          isFlushingRef.current = true;

          const flush = (records: History["records"]) =>
            new Promise<boolean>((resolve) => {
              const lastRecord = records[records.length - 1];

              if (lastRecord.type !== HistoryActionType.STACK_PUSH) {
                activityDispatch({
                  type: ActivityActionType.UPDATE_WAITING_ACTIVITY
                });
              }

              transitionTimerRef.current = setTimeout(() => {
                const { path, params, animate } =
                  records[records.length - 3] || records[records.length - 2] || lastRecord;

                activityDispatch({
                  type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY,
                  path,
                  params,
                  animate
                });
                navigationDispatch({
                  type: NavigationActionType.BACK_DONE
                });
                historyDispatch({ type: HistoryActionType.BACK });

                resolve(true);
              }, 300);
            });

          return prevState.concat({
            id,
            flush
          });
        });
      }
    }
  }, [events, activityDispatch, navigationDispatch, historyDispatch]);

  useEffect(() => {
    if (transitionBuffer.length === 0) return;

    (async () => {
      for (const { flush } of transitionBuffer) {
        if (await flush(records)) {
          setTransitionBuffer((prevState) => prevState.slice(1));
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

  return (
    <TransitionContext.Provider value={{ state, dispatch }}>{children}</TransitionContext.Provider>
  );
}

export default TransitionProvider;
