import { PropsWithChildren } from "react";

import RendererContext from "@core/renderer/RendererContext";

interface RendererProviderProps {
  params: Record<string, string>;
}

function RendererProvider({ children, params }: PropsWithChildren<RendererProviderProps>) {
  return <RendererContext.Provider value={{ params }}>{children}</RendererContext.Provider>;
}

export default RendererProvider;
