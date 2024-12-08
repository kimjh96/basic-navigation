import { useContext } from "react";

import { BaseActivity, BaseActivityParams } from "@core/activity/typing";
import RendererContext from "@core/renderer/RendererContext";

export default function useParams<T extends BaseActivity["name"]>(_: T): BaseActivityParams[T] {
  return useContext(RendererContext).params;
}
