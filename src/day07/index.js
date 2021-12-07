const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split(',').map(Number)

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const max = Math.max(...input)
  let minTotalFuel = Infinity

  for (let i = 0; i < max; i++) {
    let fuel = 0
    
    input.forEach(v => fuel += Math.abs(v - i))

    minTotalFuel = Math.min(minTotalFuel, fuel)
  }  

  return minTotalFuel
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const max = Math.max(...input)
  let minTotalFuel = Infinity

  const getFuel = (steps) => {
    if (steps === 0) return 0;
    return steps + getFuel(steps - 1)
  }

  for (let i = 0; i < max; i++) {
    let fuel = 0
    
    input.forEach(v => fuel += getFuel(Math.abs(v - i)))

    minTotalFuel = Math.min(minTotalFuel, fuel)
  }
  
  return minTotalFuel
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
