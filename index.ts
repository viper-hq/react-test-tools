import Clone from "rfdc";

type MockReset = {
  resetAllMocks: () => void;
};

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

const clone = Clone({
  circles: true,
  proto: true,
});

function resetJestMocks(o: unknown): void {
  const refs = new Set<unknown>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function resetMocksInner(o: any): void {
    if (o.mockReset) {
      return o.mockReset();
    }
    if (o instanceof Map || o instanceof Set || Array.isArray(o)) {
      return o.forEach(resetMocksInner);
    }
    refs.add(o);
    for (const k in o) {
      const cur = o[k];
      if (cur instanceof Map) {
        cur.forEach(resetMocksInner);
      } else if (cur instanceof Set) {
        cur.forEach(resetMocksInner);
      } else if (cur && !refs.has(cur)) {
        resetMocksInner(cur);
      }
    }
  }
  resetMocksInner(o);
}

/* istanbul ignore next */
export function extendGlobal(env: "none" | "jest" = "none", _global?: unknown) {
  /* istanbul ignore next */
  (_global || (global as any)).Mocked = <T>(
    m: RecursivePartial<T> = {}
  ): T & MockReset => {
    const initialValue = clone(m);
    const val = m;
    const proxy = new Proxy<RecursivePartial<T>>(val, {}) as T & MockReset;
    Object.defineProperty(proxy, "resetAllMocks", {
      configurable: false,
      enumerable: false,
      value: () => {
        const cloned = clone(initialValue);
        Object.assign(val, cloned);
        if (env === "jest") {
          resetJestMocks(val);
        }
      },
    });
    return proxy;
  };
}
