import { Children, ReactElement } from "react";

import type { RouteProps } from "@core/Route";

export default function getActivities(
  children: ReactElement<RouteProps> | ReactElement<RouteProps>[]
) {
  return Children.map(children, ({ props }) => props).map(({ name, path }) => ({
    name,
    path,
    params: {},
    activePath: path
  }));
}
