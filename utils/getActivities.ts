import { Children, ReactElement } from "react";

import type { StackRouteProps } from "@core/StackRoute";

export default function getActivities(
  children: ReactElement<StackRouteProps> | ReactElement<StackRouteProps>[]
) {
  return Children.map(children, ({ props }) => props).map(({ name, path }) => ({
    name,
    path,
    params: {},
    activePath: path
  }));
}
