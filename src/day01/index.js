const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(Number)

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  let counter = 0
  for(let i = 1; i < input.length; i++) {
    if (input[i] > input[i-1]) counter++
  }

  return counter
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const get3Count = (i) => input.slice(i,i+3).reduce((acc, val) => acc + val, 0)

  let counter = 0
  for(let i = 0; i < input.length; i++) {
    if (get3Count(i+1) > get3Count(i)) counter++
  }

  return counter
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
