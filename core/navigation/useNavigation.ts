import { useContext } from "react";

import { compile, match } from "path-to-regexp";

import ActivityContext from "@core/activity/ActivityContext";
import { BaseActivity, BaseActivityParams } from "@core/activity/typing";
import { AnimationType } from "@core/animation/typing";
import HistoryContext from "@core/history/HistoryContext";
import NavigationContext from "@core/navigation/NavigationContext";
import { NavigationActionType, NavigationStatus } from "@core/navigation/typing";

interface Options {
  animate?: boolean;
  animationType?: AnimationType;
}

export default function useNavigation() {
  const { state } = useContext(ActivityContext);
  const {
    state: { index }
  } = useContext(HistoryContext);
  const { dispatch: navigationDispatch } = useContext(NavigationContext);

  return {
    push: <T extends BaseActivity["name"]>(
      name: T,
      params: BaseActivityParams[T] = {},
      { animate = true, animationType = "slide" }: Options = {
        animate: true,
        animationType: "slide"
      }
    ) => {
      const nextActivity = state.activities.find((activity) => activity.name === name);

      if (!nextActivity) return;

      const formattedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );
      let nextPath = compile(nextActivity.path)(formattedParams);
      const nextPathMatch = match(nextActivity.path)(nextPath);
      const nextPathVariableKeys = nextPathMatch ? Object.keys(nextPathMatch?.params) : [];
      const nextParams = { ...formattedParams };

      nextPathVariableKeys.forEach((key) => {
        delete formattedParams[key];
      });

      const queryStringParams = new URLSearchParams(
        Object.entries(formattedParams).map(([key, value]) => [key, String(value)])
      ).toString();

      nextPath = queryStringParams ? `${nextPath}?${queryStringParams}` : nextPath;

      window.history.pushState(
        {
          index: index + 1,
          status: NavigationStatus.PUSH,
          scrollTop: window.scrollContainer?.scrollTop || 0,
          animate,
          animationType
        },
        "",
        nextPath
      );
      navigationDispatch({
        type: NavigationActionType.PUSH,
        path: nextPath,
        params: nextParams,
        animate,
        animationType
      });
    },
    pushRelative: <T extends BaseActivity["name"]>(
      _: T,
      params: Partial<BaseActivityParams[T]> = {},
      { animate = true, animationType = "slide" }: Options = {
        animate: true,
        animationType: "slide"
      }
    ) => {
      const currentActivity = state.currentActivity;

      if (!currentActivity) return;

      const formattedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );
      let nextPath = compile(currentActivity.path)({
        ...currentActivity.params,
        ...formattedParams
      });
      const currentMatchPath = match(currentActivity.path)(nextPath);
      const currentPathVariableKeys = currentMatchPath ? Object.keys(currentMatchPath?.params) : [];
      const nextParams = currentMatchPath ? { ...currentMatchPath?.params, ...params } : params;

      currentPathVariableKeys.forEach((key) => {
        delete formattedParams[key];
      });

      const queryStringParams = new URLSearchParams(
        Object.entries(formattedParams).map(([key, value]) => [key, String(value)])
      ).toString();

      nextPath = queryStringParams ? `${nextPath}?${queryStringParams}` : nextPath;

      window.history.pushState(
        {
          index: index + 1,
          status: NavigationStatus.STACK_PUSH,
          scrollTop: window.scrollContainer?.scrollTop || 0,
          animate,
          animationType
        },
        "",
        nextPath
      );
      navigationDispatch({
        type: NavigationActionType.STACK_PUSH,
        path: nextPath,
        params: nextParams as Record<string, string>,
        animate,
        animationType
      });
    },
    replace: <T extends BaseActivity["name"]>(
      name: T,
      params: BaseActivityParams[T] = {},
      { animate = true, animationType = "slide" }: Options = {
        animate: true,
        animationType: "slide"
      }
    ) => {
      const nextActivity = state.activities.find((activity) => activity.name === name);

      if (!nextActivity) return;

      const formattedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );
      let nextPath = compile(nextActivity.path)(formattedParams);
      const nextPathMatch = match(nextActivity.path)(nextPath);
      const nextPathVariableKeys = nextPathMatch ? Object.keys(nextPathMatch?.params) : [];
      const nextParams = { ...formattedParams };

      nextPathVariableKeys.forEach((key) => {
        delete formattedParams[key];
      });

      const queryStringParams = new URLSearchParams(
        Object.entries(formattedParams).map(([key, value]) => [key, String(value)])
      ).toString();

      nextPath = queryStringParams ? `${nextPath}?${queryStringParams}` : nextPath;

      window.history.replaceState(
        {
          index,
          status: NavigationStatus.REPLACE,
          scrollTop: window.scrollContainer?.scrollTop || 0,
          animate,
          animationType
        },
        "",
        nextPath
      );
      navigationDispatch({
        type: NavigationActionType.REPLACE,
        path: nextPath,
        params: nextParams,
        animate,
        animationType
      });
    },
    back: () => {
      window.history.back();
      navigationDispatch({
        type: NavigationActionType.BACK_START
      });
    }
  };
}
