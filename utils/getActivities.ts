import { Children, ReactElement } from "react";

import type { NavigateProps } from "@core/Navigate";

export default function getActivities(
  children: ReactElement<NavigateProps> | ReactElement<NavigateProps>[]
) {
  return Children.map(children, ({ props }) => props).map(({ name, path }) => ({
    name,
    path,
    params: {},
    activePath: path
  }));
}
