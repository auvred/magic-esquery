class Formula {
  #args

  constructor(args) {
    this.#args = args
  }
  not() {
    return new Formula.#Negation([this])
  }
  and(other) {
    return new Formula.#Conjunction([this, other])
  }
  or(other) {
    return new Formula.#Disjunction([this, other])
  }

  isdnf(level = 0) {
    return false // Default: subclass can override
  }
  dnf() {
    return this // Default: subclass MUST override
  }

  #dnfArgs() {
    return this.#args.map(arg => arg.dnf())
  }
  #negatedArgs() {
    return this.#args.map(arg => arg.not())
  }

  static #Variable = class extends Formula {
    #name
    constructor(name) {
      super([])
      this.#name = name
    }
    isdnf(level = 0) {
      return level >= 2
    }
    dnf() {
      return new Formula.#Conjunction([new Formula.#Disjunction([this])])
    }
  }

  static #Negation = class extends Formula {
    static symbol = '!'
    isdnf(level = 0) {
      return level == 2 && this.#args[0].isdnf(3)
    }
    dnf() {
      // If this is a negation of a variable, do as if it is a variable
      return this.isdnf(2)
        ? this.#args[0].dnf.call(this)
        : // Else, sift down the NOT connective
          this.#args[0].negateddnf()
    }
    negateddnf() {
      return this.#args[0].dnf()
    }
  }

  static #Conjunction = class extends Formula {
    static symbol = '^'

    isCnf(level = 0) {
      return level == 1 && this.#args.every(leaf => leaf.isCnf(2))
    }
    dnf() {
      function cartesianInner(f, args, acc = []) {
        const [first, ...rest] = args
        if (!first) {
          return acc
        }

        return cartesianInner(f, rest, [...acc, [...f, ...first]])
      }
      function cartesianSemiInner(firstArgs, head, acc = []) {
        const [first, ...rest] = firstArgs
        if (!first) {
          return acc
        }

        return cartesianSemiInner(rest, head, [
          ...acc,
          ...cartesianInner(first.#args, head),
        ])
      }
      function cartesian(dnfs) {
        const [first, ...rest] = dnfs
        if (!first) {
          return [[]]
        }

        return cartesianSemiInner(first.#args, cartesian(rest))
      }

      // A,C--A,D--B,C--B,D--E,C--E,D
      return new Formula.#Disjunction(
        cartesian(this.#dnfArgs()).map(leaves => {
          return new Formula.#Conjunction(leaves)
        }),
      )
    }
    negateddnf() {
      return new Formula.#Disjunction(this.#negatedArgs()).dnf()
    }
  }

  static #Disjunction = class extends Formula {
    static symbol = 'v'

    isCnf(level = 0) {
      return level === 0 && this.#args.every(disj => disj.isCnf(1))
    }
    dnf() {
      return new Formula.#Disjunction(
        this.#dnfArgs().flatMap(conj => conj.#args),
      )
    }
    negateddnf() {
      return new Formula.#Conjunction(this.#negatedArgs()).dnf()
    }
  }
}
