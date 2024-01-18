// sorry for bad type names, but I just wan't to finish this dnf stuff
// will rename it later
type CartesianInner<F, Args, Acc = []> = Args extends [
  infer First,
  ...infer Rest,
]
  ? CartesianInner<F, Rest, [...Acc, [...F, ...First]]>
  : Acc

type CartesianSemiInner<FArgs, Head, Acc = []> = FArgs extends [
  infer First,
  ...infer Rest,
]
  ? CartesianSemiInner<
      Rest,
      Head,
      [...Acc, ...CartesianInner<First['args'], Head>]
    >
  : Acc
type Cartesian<Dnfs> = Dnfs extends [infer First, ...infer Rest]
  ? CartesianSemiInner<First['args'], Cartesian<Rest>>
  : [[]]
type WrapCartesian<C, Acc = []> = C extends [infer First, ...infer Rest]
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

type FlatWithArgs<T, Acc = []> = T extends [infer First, ...infer Rest]
  ? FlatWithArgs<Rest, [...Acc, First['args']]>
  : never

type DnfArgs<Args, Flat extends boolean, Acc = []> = Args extends [
  infer First,
  ...infer Rest,
]
  ? DnfArgs<
      Rest,
      Flat,
      Dnf<First> extends infer Res
        ? Flat extends true
          ? Res extends [...any[]]
            ? [...Acc, ...FlatWithArgs<Res>]
            : [...Acc, ...Res['args']]
          : [...Acc, Res]
        : never
    >
  : Acc

type NegatedArgs<Args, Acc = []> = Args extends [infer First, ...infer Rest]
  ? NegatedArgs<Rest, [...Acc, { type: 'not'; arg: First }]>
  : Acc

type NotDnf<T> = IsNotDnf<T, 2> extends true
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
}
  ? Dnf<{
      type: 'and'
      args: NegatedArgs<T['args']>
    }>
  : T extends {
        type: 'and'
      }
    ? Dnf<{
        type: 'or'
        args: NegatedArgs<T['args']>
      }>
    : T extends {
          type: 'not'
        }
      ? Dnf<T['arg']>
      : never

type ConjunctionDnf<T> = unknown & {
  type: 'or'
  args: WrapCartesian<Cartesian<DnfArgs<T['args'], false>>>
}

type DisjunctionDnf<T> = IsDisjunctionDnf<T, 0> extends true
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
  ? First extends string
    ? IsVariableDnf<Depth>
    : First extends {
          type: 'and'
        }
      ? IsConjunctionDnf<First, Depth> extends true
        ? EveryArgIsDnf<Rest, Depth>
        : false
      : First extends {
            type: 'or'
          }
        ? IsDisjunctionDnf<First, Depth> extends true
          ? EveryArgIsDnf<Rest, Depth>
          : false
        : First extends {
              type: 'not'
            }
          ? IsNotDnf<First, Depth> extends true
            ? EveryArgIsDnf<Rest, Depth>
            : false
          : never
  : true
type IsNotDnf<T, Depth> = Depth extends 2 ? EveryArgIsDnf<[T['arg']], 3> : false
type IsDisjunctionDnf<T, Depth> = Depth extends 0
  ? EveryArgIsDnf<T['args'], 1>
  : false
type IsConjunctionDnf<T, Depth> = Depth extends 1
  ? EveryArgIsDnf<T['args'], 2>
  : false

type Dnf<T> = T extends string
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
      }
    ? DisjunctionDnf<T>
    : T extends {
          type: 'and'
        }
      ? ConjunctionDnf<T>
      : T extends {
            type: 'not'
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
            arg: 'd'
          },
        ]
      }
    },
  ]
}

type OOOOOHHHHHHHHHHHHHHHHHHHHHITSWORKINGGGGGGGGGGGGGG = Dnf<formula>
