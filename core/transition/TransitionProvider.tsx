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

  const transitionTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
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
          type: NavigationActionType.NAVIGATING
        });
        dispatch({ type: HistoryActionType.PUSH, path: event.path, params: event.params });

        setTransitionBuffer((prevState) => {
          const id = `${event.path}-${event.status}`;
          const transition = prevState.find((item) => item.id === id);

          if (transition) {
            return prevState.filter((prevTransition) => prevTransition.id !== transition.id);
          }

          const flush = () =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current[id] = setTimeout(() => {
                navigationDispatch({
                  type: NavigationActionType.DONE
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
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params
        });
        navigationDispatch({
          type: NavigationActionType.NAVIGATING
        });
        dispatch({ type: HistoryActionType.STACK_PUSH, path: event.path, params: event.params });

        setTransitionBuffer((prevState) => {
          const id = `${event.path}-${event.status}`;
          const transition = prevState.find((item) => item.id === id);

          if (transition) {
            return prevState.filter((prevTransition) => prevTransition.id !== transition.id);
          }

          const flush = () =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current[id] = setTimeout(() => {
                navigationDispatch({
                  type: NavigationActionType.DONE
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
        activityDispatch({
          type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
          path: event.path,
          params: event.params
        });
        navigationDispatch({
          type: NavigationActionType.NAVIGATING
        });
        dispatch({ type: HistoryActionType.PUSH, path: event.path, params: event.params });

        setTransitionBuffer((prevState) => {
          const id = `${event.path}-${event.status}`;
          const transition = prevState.find((item) => item.id === id);

          if (transition) {
            return prevState.filter((prevTransition) => prevTransition.id !== transition.id);
          }

          const flush = (records: History["records"]) =>
            new Promise<boolean>((resolve) => {
              transitionTimerRef.current[id] = setTimeout(() => {
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
                  type: NavigationActionType.DONE
                });
                dispatch({
                  type: HistoryActionType.REPLACE,
                  path: event.path,
                  params: event.params
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
        setTransitionBuffer((prevState) => {
          const id = `${event.path}-${event.status}`;
          const transition = prevState.find((item) => item.id === id);

          if (transition) {
            return prevState.filter((prevTransition) => prevTransition.id !== transition.id);
          }

          const flush = (records: History["records"]) =>
            new Promise<boolean>((resolve) => {
              navigationDispatch({
                type: NavigationActionType.NAVIGATING
              });

              const lastRecord = records[records.length - 1];

              if (lastRecord.type !== HistoryActionType.STACK_PUSH) {
                activityDispatch({
                  type: ActivityActionType.UPDATE_WAITING_ACTIVITY
                });
              }

              transitionTimerRef.current[id] = setTimeout(() => {
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
                dispatch({ type: HistoryActionType.BACK });
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
    const transitionTimer = transitionTimerRef.current;

    return () => {
      for (const transitionId in transitionTimer) {
        if (transitionTimer[transitionId]) {
          clearTimeout(transitionTimer[transitionId]);
        }
      }
    };
  }, []);

  return children;
}

export default TransitionProvider;
