const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n')

const goA = (rawInput) => {
  const input = prepareInput(rawInput)
  const submarine = { position: 0, depth: 0}

  input.forEach((command) => {
    const type = command[0]
    const value = Number(command.split(' ')?.[1])

    if (type === 'f') submarine.position += value
    else if (type === 'd') submarine.depth += value
    else if (type === 'u') submarine.depth -= value
  })

  return submarine.position * submarine.depth
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)
  const submarine = { position: 0, depth: 0, aim: 0}

  input.forEach((command) => {
    const type = command[0]
    const value = Number(command.split(' ')?.[1])

    if (type === 'f') {
      submarine.position += value
      submarine.depth += submarine.aim * value
    } else if (type === 'd') submarine.aim += value
    else if (type === 'u') submarine.aim -= value
  })

  return submarine.position * submarine.depth
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
