const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  return
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  return
}

/* Tests */

// test(goA(`rawInput`), expected)
// test(goB(`rawInput`), expected)

/* Results */
const input = read()

console.time('Time')
const resultA = goA(input)
console.timeEnd('Time')
console.log('Solution to part 1:', resultA)

console.time('Time')
const resultB = goB(input)
console.timeEnd('Time')
console.log('Solution to part 2:', resultB)
