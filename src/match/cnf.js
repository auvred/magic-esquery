class Formula {
  #args

  constructor(...args) {
    this.#args = args
  }
  // Methods to return a formula that applied a connective to this formula
  not() {
    return new Formula.#Negation(this)
  }
  and(other) {
    return new Formula.#Conjunction(this, other)
  }
  or(other) {
    return new Formula.#Disjunction(this, other)
  }
  implies(other) {
    return new Formula.#Conditional(this, other)
  }

  // ==== Methods that can be overridden by the subclasses ====

  // Evaluate the formula using explicit FALSE/TRUE values.
  // A Variable will evaluate to TRUE if and only when it is in
  //      the Set that is given as argument.
  evaluate(trueVariables) {
    // Default is undefined: subclass MUST override and return boolean
  }
  toString() {
    // Default: subclass can override
    return this.#stringifyArgs().join(this.constructor.symbol)
  }
  // Return whether this formula is in CNF format
  // If level is provided, it verifies whether this formula
  //    can be at that level within a CNF structure.
  isCnf(level = 0) {
    return false // Default: subclass can override
  }
  // Return an equivalent formula that is in CNF format
  cnf() {
    return this // Default: subclass MUST override
  }
  // Get list of all variables used in this formula
  usedVariables() {
    // Formula.Variable should override this
    return [...new Set(this.#args.flatMap(arg => arg.usedVariables()))]
  }

  // ==== Methods that are fully implemented (no need to override) ====

  // Brute-force way to compare whether two formulas are equivalent:
  //    It provides all the used variables all possible value combinations,
  //    and compares the outcomes.
  equivalent(other) {
    const usedVariables = [
      ...new Set(this.usedVariables().concat(other.usedVariables())),
    ]
    const trueVariables = new Set()

    const recur = i => {
      if (i >= usedVariables.length) {
        // All usedVariables have a value. Make the evaluation
        return this.evaluate(trueVariables) === other.evaluate(trueVariables)
      }
      trueVariables.delete(usedVariables[i])
      if (!recur(i + 1)) {
        return false
      }
      trueVariables.add(usedVariables[i])
      return recur(i + 1)
    }

    return recur(0)
  }
  // Utility functions for mapping the args member
  #cnfArgs() {
    return this.#args.map(arg => arg.cnf())
  }
  #negatedArgs() {
    return this.#args.map(arg => arg.not())
  }
  #evalArgs(trueVariables) {
    return this.#args.map(arg => arg.evaluate(trueVariables))
  }
  #stringifyArgs() {
    return this.#args.length < 2
      ? this.#args.map(String) // No parentheses needed
      : this.#args.map(arg => (arg.#args.length > 1 ? `(${arg})` : `${arg}`))
  }
  // Giving a more verbose output than toString(). For debugging.
  dump(indent = '') {
    return [
      `${indent + this.constructor.name} (`,
      ...this.#args.map(arg => arg.dump(`${indent}  `)),
      `${indent})`,
    ].join('\n')
  }

  // ==== Static members ====
  // Collection of all the variables used in any formula, keyed by name
  static #variables = new Map()
  // Get or create a variable, avoiding different instances for the same name
  static getVariable(name) {
    return (
      this.#variables.get(name) ??
      this.#variables.set(name, new this.#Variable(name)).get(name)
    )
  }
  // Parse a string into a Formula.
  // (No error handling: assumes the syntax is valid)
  static parse(str) {
    const iter = str[Symbol.iterator]()

    function recur(end) {
      let formula
      const connectives = []
      for (const ch of iter) {
        if (ch === end) {
          break
        }
        if ('^v~→'.includes(ch)) {
          connectives.push(ch)
        } else {
          let arg = ch == '(' ? recur(')') : Formula.getVariable(ch)
          while (connectives.length > 0) {
            const oper = connectives.pop()
            arg =
              oper == '~'
                ? arg.not()
                : oper == '^'
                  ? formula.and(arg)
                  : oper == 'v'
                    ? formula.or(arg)
                    : formula.implies(arg)
          }
          formula = arg
        }
      }
      return formula
    }
    return recur()
  }

  // Subclasses: private.
  // There is no need to create instances explicitly
  //    from outside the class.

  static #Variable = class extends Formula {
    #name
    constructor(name) {
      super()
      this.#name = name
    }
    evaluate(trueVariables) {
      return trueVariables.has(this)
    }
    toString() {
      return this.#name
    }
    dump(indent = '') {
      return `${indent + this.constructor.name} ${this}`
    }
    isCnf(level = 0) {
      return level >= 2
    }
    cnf() {
      return new Formula.#Conjunction(new Formula.#Disjunction(this))
    }
    usedVariables() {
      return [this]
    }
  }

  static #Negation = class extends Formula {
    static symbol = '~'
    evaluate(trueVariables) {
      return !this.#evalArgs(trueVariables)[0]
    }
    toString() {
      return (
        this.constructor.symbol +
        (this.#args[0].#args.length > 1 ? `(${this.#args[0]})` : this.#args[0])
      )
    }
    isCnf(level = 0) {
      return level == 2 && this.#args[0].isCnf(3)
    }
    cnf() {
      // If this is a negation of a variable, do as if it is a variable
      return this.isCnf(2)
        ? this.#args[0].cnf.call(this)
        : // Else, sift down the NOT connective
          this.#args[0].negatedCnf()
    }
    negatedCnf() {
      return this.#args[0].cnf()
    }
  }

  static #Disjunction = class extends Formula {
    static symbol = 'v'
    evaluate(trueVariables) {
      return this.#evalArgs(trueVariables).some(Boolean)
    }
    isCnf(level = 0) {
      return level == 1 && this.#args.every(leaf => leaf.isCnf(2))
    }
    cnf() {
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

      return new Formula.#Conjunction(
        ...Array.from(
          cartesian(this.#cnfArgs()),
          leaves => new Formula.#Disjunction(...leaves),
        ),
      )
    }
    negatedCnf() {
      return new Formula.#Conjunction(...this.#negatedArgs()).cnf()
    }
  }

  static #Conjunction = class extends Formula {
    static symbol = '^'
    evaluate(trueVariables) {
      return this.#evalArgs(trueVariables).every(Boolean)
    }
    isCnf(level = 0) {
      return level === 0 && this.#args.every(disj => disj.isCnf(1))
    }
    cnf() {
      debugger
      return this.isCnf(0)
        ? this // already in CNF format
        : new Formula.#Conjunction(
            ...this.#cnfArgs().flatMap(conj => conj.#args),
          )
    }
    negatedCnf() {
      return new Formula.#Disjunction(...this.#negatedArgs()).cnf()
    }
  }

  static #Conditional = class extends Formula {
    static symbol = '→'
    evaluate(trueVariables) {
      return this.#evalArgs(trueVariables).reduce((a, b) => a <= b)
    }
    cnf() {
      return this.#args[0].not().or(this.#args[1]).cnf()
    }
    negatedCnf() {
      return this.#args[0].and(this.#args[1].not()).cnf()
    }
  }
}

// Examples

// Create variables
const P = Formula.getVariable('P')
const Q = Formula.getVariable('Q')
const R = Formula.getVariable('R')
const S = Formula.getVariable('S')
const T = Formula.getVariable('T')

// Build a formula using the variables
//      (P^Q^~R)v(~S^T)
// const formula = P.and(Q).and(R).or(S.and(T))

// ...or parse a string (This will create variables where needed)
const formula = Formula.parse('(A^B)v(C^D)')

// Get the string representation of a formula
console.log(`Formula: ${formula}`)

// Check whether the formula has a CNF structure
console.log(`Is it CNF: ${formula.isCnf()}`)

// Create a CNF equivalent for a formula
const cnfFormula = formula.cnf()
console.log(`In CNF: ${cnfFormula}`)

// Verify that they are equivalent
console.log('Is equivalent?', formula.equivalent(cnfFormula))

// Evaluate the formula providing it the set of variables that are true
console.log(
  'When only P and T are true, this evaluates to:',
  formula.evaluate(new Set([P, T])),
)
