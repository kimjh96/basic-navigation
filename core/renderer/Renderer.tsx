import { Children, cloneElement, isValidElement, PropsWithChildren, useContext } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { RouteProps } from "@core/Route";

import HistoryContext from "@core/history/HistoryContext";
import RendererProvider from "@core/renderer/RendererProvider";

function Renderer({ children }: PropsWithChildren) {
  const {
    state: { records }
  } = useContext(HistoryContext);

  return Array.from(
    new Map(
      records.map((record) => {
        const [originPath] = record.path.split("?");
        return [originPath, { ...record, originPath, path: record.path }];
      })
    ).values()
  ).map(({ originPath, path, params }) =>
    Children.map(children, (child) => {
      if (!isValidElement<RouteProps>(child)) {
        return null;
      }

      if (pathToRegexp(child.props.path).regexp.test(originPath)) {
        return (
          <RendererProvider params={params}>
            {cloneElement(child, { ...child.props, params, activePath: path })}
          </RendererProvider>
        );
      }

      return null;
    })
  );
}

export default Renderer;
