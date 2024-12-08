import { Children, cloneElement, isValidElement, PropsWithChildren, useContext } from "react";

import { pathToRegexp } from "path-to-regexp";

import type { NavigateProps } from "@core/Navigate";

import HistoryContext from "@core/history/HistoryContext";
import RendererProvider from "@core/renderer/RendererProvider";

function Renderer({ children }: PropsWithChildren) {
  const {
    state: { records }
  } = useContext(HistoryContext);

  return records.map(({ path, params }) =>
    Children.map(children, (child) => {
      if (!isValidElement<NavigateProps>(child)) {
        return null;
      }

      if (pathToRegexp(child.props.path).regexp.test(path)) {
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
