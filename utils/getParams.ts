import { match, pathToRegexp } from "path-to-regexp";

export default function getParams(paths: string[], path: string, search: string) {
  const regex = paths.find((p) => pathToRegexp(p).regexp.test(path)) || "";
  const matchPath = match(regex)(path);
  const searchParams = new URLSearchParams(search);
  const params = Object.fromEntries(searchParams.entries());

  if (matchPath) {
    return { ...(matchPath.params as Record<string, string>), ...params };
  }

  return {};
}
