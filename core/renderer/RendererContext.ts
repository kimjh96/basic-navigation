import { createContext } from "react";

interface RendererContextProps {
  params: Record<string, string>;
}

const RendererContext = createContext<RendererContextProps>({
  params: {}
});

export default RendererContext;
