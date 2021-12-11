const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(line => line.split('').map(Number))

const inc1 = (oct) => oct.map(l => l.map(v => v + 1))

const octopusVisited = (oct, a, b) => {
  for (let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      oct?.[a+i]?.[b+j] ? oct[a+i][b+j]++ : null
    }
  }

  return oct
}

const step = (input) => {
  const visited = new Set()

  input = inc1(input)
  let repeat, newInput

  do {
    repeat = false
    for (let i = 0; i < input.length; i++) {
      for(let j = 0; j < input[i].length; j++) {
        if (!visited.has(`${i},${j}`) && input[i][j] > 9) {
          visited.add(`${i},${j}`)
          newInput = octopusVisited(input, i, j)
          repeat = true
        }
      }
    }

    if (repeat) input = newInput
  } while (repeat)

  input = input.map(l => l.map(v => v > 9 ? 0:v))

  return { input, flashes: visited.size }
}

const isSynchronized = (oct) => {
  for(let i = 0; i < oct.length; i++) {
    for(let j = 0; j < oct[i].length; j++) {
      if (oct[i][j]) return false
    }
  }

  return true
}

const goA = (rawInput) => {
  let input = prepareInput(rawInput)
  

  let values = { input, flashes: 0}
  let totalFlashes = 0

  for(let i = 0; i < 100; i++) {
    values = step(values.input)
    totalFlashes += values.flashes
  }
  
  return totalFlashes
}

const goB = (rawInput) => {
  let input = prepareInput(rawInput)
  
  let values = { input, flashes: 0}
  let round = 0

  do {
    round++;
    values = step(values.input)

  } while(!isSynchronized(values.input))
  
  return round
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
