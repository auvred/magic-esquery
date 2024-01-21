// Source: https://github.com/sindresorhus/type-fest/blob/eb96609c1b4db7afbf394e8b52fcf95b74bce159/source/simplify.d.ts
// eslint-disable-next-line ts/ban-types
export type Simplify<T> = { [K in keyof T]: T[K] } & {}

// Source: https://github.com/type-challenges/type-challenges/blob/e77262dba62e9254451f661cb4fe5517ffd1d933/utils/index.d.ts
export type Expect<T extends true> = T
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false
