import { extendGlobal } from ".";

type Mockable = {
  foo: {
    bar: {
      baz: false;
      baz2: true;
    };
    bar2: string;
    fn: () => number;
    arr: ["42"];
    map: Map<string, string>;
    set: Set<string>;
  };
  foo2: number;
};

describe("extendGlobal", () => {
  it("should extend global and should not reset jest functions", () => {
    const newGlob = {} as NodeJS.Global;
    extendGlobal("none", newGlob);
    const a = newGlob.Mocked({
      fn: jest.fn(),
    });
    expect(a.fn()).toBeUndefined();
    expect(a.fn).toBeCalledTimes(1);
    (a as any).resetAllMocks();
    expect(a.fn()).toBeUndefined();
    expect(a.fn).toBeCalledTimes(2);
  });
  it("should extend global and should reset jest functions", () => {
    const newGlob = {} as NodeJS.Global;
    extendGlobal("jest", newGlob);
    const a = newGlob.Mocked({
      fn: jest.fn(),
    });
    expect(a.fn()).toBeUndefined();
    expect(a.fn).toBeCalledTimes(1);
    (a as any).resetAllMocks();
    expect(a.fn()).toBeUndefined();
    expect(a.fn).toBeCalledTimes(1);
  });
});

describe("Mocked", () => {
  const mockable = Mocked<Mockable>({
    foo: {
      bar2: "42",
      fn: jest.fn(),
      arr: ["42"],
      map: new Map([["a", "b"]]),
      set: new Set(["a"]),
    },
  });

  beforeEach(() => {
    mockable.resetAllMocks();
  });

  it("should mock the Mockable", () => {
    expect(mockable.foo.bar2).toStrictEqual("42");
  });

  it("should reset the mock", () => {
    mockable.foo.bar2 = "43";
    expect(mockable.foo.bar2).toStrictEqual("43");
    mockable.resetAllMocks();
    expect(mockable.foo.bar2).toStrictEqual("42");
  });

  it("should reset the jest mock", () => {
    expect(mockable.foo.fn()).toStrictEqual(undefined);
    expect(mockable.foo.fn).toBeCalledTimes(1);
    mockable.resetAllMocks();
    expect(mockable.foo.fn()).toStrictEqual(undefined);
    expect(mockable.foo.fn).toBeCalledTimes(1);
  });
});
