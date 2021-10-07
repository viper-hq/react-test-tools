# Testing tools for React based applications

[![npm](https://img.shields.io/npm/v/@viperhq/react-test-tools.svg)](https://www.npmjs.com/package/@viperhq/react-test-tools)

## Install

`npm install @viperhq/react-test-tools`

### Extend Global

Open `jest.setup.ts` or any `setupFilesAfterEnv` setup file where you can access the `global` used in tests.

```typescript
import { extendGlobal } from "react-test-tools";

// Enables jest based functionality
extendGlobal("jest");
```

### Global type definitions

Open `tsconfig.json` used in tests and add an include:

```json
{
  "include": ["node_modules/@viperhq/react-test-tools/global.d.ts"]
}
```

## Usage

### Mocked

It allows you to Mock objects in a type safer way.

You can reset the object to default value using `resetAllMocks()`.

Example:

```typescript
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

describe("test", () => {
  const mockable = Mocked<Mockable>({
    foo2: 42,
    foo: {
      fn: jest.fn(),
    },
  });

  beforeEach(() => {
    mockable.resetAllMocks();
    mockable.foo.fn.mockImplementation(() => 42);
  });

  it("should be 42", () => {
    expect(mockable.foo.fn()).toEqual(42);
    mockable.foo2 = 43;
  });

  it("should be 42 here too", () => {
    expect(mockable.foo2).toEqual(42);
  });
});
```

#### Caveats with Mocked objects

- Values cannot be cloned keep their state on reset. `jest.fn()` mocks can be reseted if `extendGlobal` called with the parameter `"jest"`.

- Mocked objects cannot be nested at the moment.
