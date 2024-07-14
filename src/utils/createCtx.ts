import { createContext, useContext } from "react";

/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
export default function createCtx<S extends unknown | null>(name: string) {
  const ctx = createContext<S | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined)
      throw new Error(
        `use${
          name.charAt(0).toLocaleUpperCase() + name.substring(1)
        } must be inside a Provider with a value`
      );
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}
