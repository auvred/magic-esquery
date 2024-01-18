// sorry for bad type names, but I just wan't to finish this dnf stuff

import type { MetaAcc } from './utils'

// will rename it later
type CartesianInner<
  F extends any[],
  Args,
  Acc extends any[] = [],
> = Args extends [infer First, ...infer Rest]
  ? First extends any[]
    ? CartesianInner<F, Rest, [...Acc, [...F, ...First]]>
    : never
  : Acc

type CartesianSemiInner<FArgs, Head, Acc extends any[] = []> = FArgs extends [
  infer First,
  ...infer Rest,
]
  ? First extends {
      args: any[]
    }
    ? CartesianSemiInner<
        Rest,
        Head,
        [...Acc, ...CartesianInner<First['args'], Head>]
      >
    : never
  : Acc
type Cartesian<Dnfs> = Dnfs extends [infer First, ...infer Rest]
  ? First extends {
      args: any[]
    }
    ? CartesianSemiInner<First['args'], Cartesian<Rest>>
    : never
  : [[]]
type WrapCartesian<C, Acc extends any[] = []> = C extends [
  infer First,
  ...infer Rest,
]
  ? WrapCartesian<
      Rest,
      [
        ...Acc,
        {
          type: 'and'
          args: First
        },
      ]
    >
  : Acc

type FlatWithArgs<T, Acc extends any[] = []> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends {
      args: any[]
    }
    ? FlatWithArgs<Rest, [...Acc, First['args']]>
    : never
  : never

type DnfArgs<
  Args,
  Flat extends boolean,
  Acc extends any[] = [],
> = Args extends [infer First, ...infer Rest]
  ? DnfArgs<
      Rest,
      Flat,
      Dnf<First> extends infer Res
        ? Res extends {
            args: any[]
          }
          ? Flat extends true
            ? Res extends [...any[]]
              ? [...Acc, ...FlatWithArgs<Res>]
              : [...Acc, ...Res['args']]
            : [...Acc, Res]
          : never
        : never
    >
  : Acc

type NegatedArgs<Args, Acc extends any[] = []> = Args extends [
  infer First,
  ...infer Rest,
]
  ? NegatedArgs<Rest, [...Acc, { type: 'not'; arg: First }]>
  : Acc

type NotDnf<
  T extends {
    type: 'not'
    arg: any
  },
> = IsNotDnf<T, 2> extends true
  ? {
      type: 'or'
      args: [
        {
          type: 'and'
          args: [T]
        },
      ]
    }
  : NegatedDnf<T['arg']>

type NegatedDnf<T> = T extends {
  type: 'or'
  args: any[]
}
  ? Dnf<{
      type: 'and'
      args: NegatedArgs<T['args']>
    }>
  : T extends {
        type: 'and'
        args: any[]
      }
    ? Dnf<{
        type: 'or'
        args: NegatedArgs<T['args']>
      }>
    : T extends {
          type: 'not'
          arg: any
        }
      ? Dnf<T['arg']>
      : never

type ConjunctionDnf<
  T extends {
    type: 'and'
    args: any[]
  },
> = unknown & {
  type: 'or'
  args: WrapCartesian<Cartesian<DnfArgs<T['args'], false>>>
}

type DisjunctionDnf<
  T extends {
    type: 'or'
    args: any[]
  },
> = IsDisjunctionDnf<T, 0> extends true
  ? T
  : {
      type: 'or'
      args: DnfArgs<T['args'], true>
    }

// depth >= 2
type IsVariableDnf<Depth> = Depth extends 0
  ? false
  : Depth extends 1
    ? false
    : true

type EveryArgIsDnf<Args, Depth> = Args extends [infer First, ...infer Rest]
  ? First extends MetaAcc
    ? IsVariableDnf<Depth>
    : First extends {
          type: 'and'
          args: any[]
        }
      ? IsConjunctionDnf<First, Depth> extends true
        ? EveryArgIsDnf<Rest, Depth>
        : false
      : First extends {
            type: 'or'
            args: any[]
          }
        ? IsDisjunctionDnf<First, Depth> extends true
          ? EveryArgIsDnf<Rest, Depth>
          : false
        : First extends {
              type: 'not'
              arg: any
            }
          ? IsNotDnf<First, Depth> extends true
            ? EveryArgIsDnf<Rest, Depth>
            : false
          : never
  : true
type IsNotDnf<
  T extends {
    type: 'not'
    arg: any
  },
  Depth,
> = Depth extends 2 ? EveryArgIsDnf<[T['arg']], 3> : false
type IsDisjunctionDnf<
  T extends {
    type: 'or'
    args: any[]
  },
  Depth,
> = Depth extends 0 ? EveryArgIsDnf<T['args'], 1> : false
type IsConjunctionDnf<
  T extends {
    type: 'and'
    args: any[]
  },
  Depth,
> = Depth extends 1 ? EveryArgIsDnf<T['args'], 2> : false

export type Dnf<T> = T extends MetaAcc
  ? // variable
    {
      type: 'or'
      args: [
        {
          type: 'and'
          args: [T]
        },
      ]
    }
  : T extends {
        type: 'or'
        args: any[]
      }
    ? DisjunctionDnf<T>
    : T extends {
          type: 'and'
          args: any[]
        }
      ? ConjunctionDnf<T>
      : T extends {
            type: 'not'
            arg: any
          }
        ? NotDnf<T>
        : never

type formula = unknown & {
  type: 'and'
  args: [
    {
      type: 'or'
      args: ['a', 'b']
    },
    {
      type: 'not'
      arg: {
        type: 'or'
        args: [
          'c',
          {
            type: 'not'
            arg: {
              type: 'or'
              args: [
                '11',
                {
                  type: 'not'
                  arg: '22'
                },
              ]
            }
          },
        ]
      }
    },
  ]
}

type _OOOOOHHHHHHHHHHHHHHHHHHHHHITSWORKINGGGGGGGGGGGGGG = Dnf<formula>
