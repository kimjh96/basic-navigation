import { PropsWithChildren, useContext, useEffect, useReducer, useRef, useCallback } from "react";

import ActivityContext from "@core/activity/ActivityContext";
import { ActivityActionType } from "@core/activity/typing";
import HistoryContext from "@core/history/HistoryContext";
import { HistoryActionType } from "@core/history/typing";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationEvent, NavigationStatus } from "@core/navigation/typing";
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
    state: { events, status },
    dispatch: navigationDispatch
  } = useContext(NavigationContext);

  const transitionTimerRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const processingEventRef = useRef<Set<string>>(new Set());
  const eventQueueRef = useRef<{ id: string; event: NavigationEvent }[]>([]);
  const isProcessingRef = useRef(false);
  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);
  const lastStatusRef = useRef(status);
  const recordsRef = useRef(records);

  const createTransitionTimer = (callback: () => void, delay: number = 300) => {
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        try {
          callback();
          resolve(true);
        } catch {
          resolve(false);
        } finally {
          transitionTimerRef.current.delete(timer);
          pendingResolveRef.current = null;
        }
      }, delay);
      transitionTimerRef.current.add(timer);
    });
  };

  const clearAllTimers = () => {
    transitionTimerRef.current.forEach((timer) => {
      clearTimeout(timer);
      transitionTimerRef.current.delete(timer);
    });
    transitionTimerRef.current.clear();
    if (pendingResolveRef.current) {
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  // 상태 업데이트 후 pendingResolve 실행 (순서보장)
  useEffect(() => {
    if (pendingResolveRef.current && status !== lastStatusRef.current) {
      pendingResolveRef.current(true);
      pendingResolveRef.current = null;
      lastStatusRef.current = status;
    }
  }, [status]);

  // 이벤트 큐 처리 함수
  const processEvents = useCallback(async () => {
    if (eventQueueRef.current.length === 0 || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    while (eventQueueRef.current.length > 0) {
      const { id, event } = eventQueueRef.current[0];

      if (processingEventRef.current.has(id)) {
        eventQueueRef.current.shift();
        continue;
      }

      processingEventRef.current.add(id);

      try {
        if (event.status === NavigationStatus.PUSH) {
          navigationDispatch({
            type: NavigationActionType.PUSH_NAVIGATING
          });
          historyDispatch({
            type: HistoryActionType.PUSH,
            path: event.path,
            params: event.params,
            animate: event.animate,
            animationType: event.animationType
          });
          activityDispatch({
            type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
            path: event.path,
            params: event.params,
            animate: event.animate,
            animationType: event.animationType
          });

          await createTransitionTimer(() => {
            navigationDispatch({
              type: NavigationActionType.PUSH_DONE
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
            animate: event.animate,
            animationType: event.animationType
          });
          activityDispatch({
            type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
            path: event.path,
            params: event.params,
            animate: event.animate,
            animationType: event.animationType
          });

          await createTransitionTimer(() => {
            navigationDispatch({
              type: NavigationActionType.STACK_PUSH_DONE
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
            animate: event.animate,
            animationType: event.animationType
          });
          activityDispatch({
            type: ActivityActionType.UPDATE_CURRENT_ACTIVITY,
            path: event.path,
            params: event.params,
            animate: event.animate,
            animationType: event.animationType
          });

          await createTransitionTimer(async () => {
            const { path, params, animate, animationType } =
              recordsRef.current[recordsRef.current.length - 3] ||
              recordsRef.current[recordsRef.current.length - 2] ||
              recordsRef.current[recordsRef.current.length - 1];

            activityDispatch({
              type: ActivityActionType.UPDATE_SPECIFY_PREVIOUS_ACTIVITY,
              path,
              params,
              animate,
              animationType
            });

            await createTransitionTimer(() => {
              historyDispatch({
                type: HistoryActionType.REPLACE,
                path: event.path,
                params: event.params,
                animate: event.animate,
                animationType: event.animationType
              });
              navigationDispatch({
                type: NavigationActionType.REPLACE_DONE
              });
            }, 10);
          });
        } else if (event.status === NavigationStatus.BACK) {
          navigationDispatch({
            type: NavigationActionType.BACK_NAVIGATING
          });

          const lastRecord = recordsRef.current[recordsRef.current.length - 1];

          if (lastRecord.type !== HistoryActionType.STACK_PUSH) {
            activityDispatch({
              type: ActivityActionType.UPDATE_WAITING_ACTIVITY
            });
          }

          await createTransitionTimer(async () => {
            const { path, params, animate, animationType } =
              recordsRef.current[recordsRef.current.length - 3] ||
              recordsRef.current[recordsRef.current.length - 2] ||
              lastRecord;

            activityDispatch({
              type: ActivityActionType.UPDATE_PREVIOUS_ACTIVITY,
              path,
              params,
              animate,
              animationType
            });

            await createTransitionTimer(() => {
              historyDispatch({ type: HistoryActionType.BACK });
              navigationDispatch({
                type: NavigationActionType.BACK_DONE
              });
            }, 10);
          });
        }
      } finally {
        processingEventRef.current.delete(id);
        eventQueueRef.current.shift();
      }
    }
    isProcessingRef.current = false;

    // 큐가 비어있지 않다면 다시 처리 시작
    if (eventQueueRef.current.length > 0) {
      processEvents();
    }
  }, [activityDispatch, navigationDispatch, historyDispatch]);

  // 이벤트 큐 업데이트
  useEffect(() => {
    const newEvents = events.filter(
      (event) =>
        !eventQueueRef.current.some(
          (item) => item.id === `${event.path}-${event.status}-${event.recordedAt}`
        )
    );

    if (newEvents.length > 0) {
      eventQueueRef.current = [
        ...eventQueueRef.current,
        ...newEvents.map((event) => ({
          id: `${event.path}-${event.status}-${event.recordedAt}`,
          event
        }))
      ];
      // 이벤트가 추가되면 처리 시작
      if (!isProcessingRef.current) {
        processEvents();
      }
    }
  }, [events, processEvents]);

  // 초기 이벤트 큐 처리 시작
  useEffect(() => {
    if (eventQueueRef.current.length > 0 && !isProcessingRef.current) {
      processEvents();
    }
  }, [processEvents]);

  return (
    <TransitionContext.Provider value={{ state, dispatch }}>{children}</TransitionContext.Provider>
  );
}

export default TransitionProvider;
