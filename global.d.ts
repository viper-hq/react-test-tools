declare type MockReset = {
  resetAllMocks: () => void;
};

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

declare function Mocked<T>(m?: RecursivePartial<T>): T & MockReset;

declare namespace NodeJS {
  interface Global {
    Mocked<T>(m: RecursivePartial<T>): T;
  }
}
