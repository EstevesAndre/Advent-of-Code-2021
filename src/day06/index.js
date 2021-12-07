const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split(',').map(Number)

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const DAYS = 80
  const NEW_LANTERN_NUMBER = 8
  const RESET_NUMBER = 6

  for (let i = 0; i < DAYS; i++) {
    const lastIndex = input.length
    for (let index = 0; index < lastIndex; index++) {
      if (input[index] === 0) {
        input[index] = RESET_NUMBER
        input.push(NEW_LANTERN_NUMBER)
      } else {
        input[index]--
      }
    }
  }

  return input.length
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const DAYS = 256
  const NEW_LANTERN_NUMBER = 8
  const RESET_NUMBER = 6
  const values = {}

  for (let i = 0; i <= NEW_LANTERN_NUMBER; i++) values[i] = 0
  for (let i = 0; i < input.length; i++) values[input[i]]++

  for (let d = 0; d < DAYS; d++) {
    const nextValues = {}

    const resetValues = values[0]
    for (let i = 1; i <= NEW_LANTERN_NUMBER; i++) {
      nextValues[i-1] = values[i]
    }
    nextValues[RESET_NUMBER] += resetValues
    nextValues[NEW_LANTERN_NUMBER] = resetValues

    
    for (let i = 0; i <= NEW_LANTERN_NUMBER; i++) values[i] = nextValues[i]
  }
  
  return Object.values(values).reduce((acc, v) => acc+v)
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
