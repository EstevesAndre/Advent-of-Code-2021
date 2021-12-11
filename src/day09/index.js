const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(l => l.split('').map(Number))

const getValue = (heightmap, i, j) => heightmap?.[i]?.[j] ?? Infinity

const getAdjacents = (heightmap,i, j) => [
    getValue(heightmap, i-1, j),
    getValue(heightmap, i+1, j),
    getValue(heightmap, i, j-1),
    getValue(heightmap, i, j+1)
]

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const getMinValue = (line, i) => 
    line.reduce((acc, v, j) => 
      acc + (v < Math.min(...getAdjacents(input, i, j)) ? v + 1 : 0), 
      0
    )

  return input.reduce((acc, line, i) => acc + getMinValue(line, i), 0)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)
  const basins = [0, 0, 0]

  const isBasin = (v, i, j) => v < Math.min(...getAdjacents(input, i, j))

  const calculateBasinSize = (i, j, visited) => {
    if (i < 0 || 
      j < 0 || 
      i >= input.length ||
      j >= input[i].length || 
      visited.has(`${i},${j}`)
    ) return 0

    const v = input[i][j]
    visited.add(`${i},${j}`)

    if (v === 9) return 0

    return calculateBasinSize(i-1,j, visited) + calculateBasinSize(i+1,j, visited) + calculateBasinSize(i,j-1, visited) + calculateBasinSize(i,j+1, visited) + 1
  }

  input.forEach((line, i) => {
    line.forEach((v, j) => {
      if (isBasin(v, i, j)) {
        const size = calculateBasinSize(i,j,new Set())
        const minValue = Math.min(...basins)

        if (size > minValue) {
          basins[basins.indexOf(minValue)] = size
        }
      }
    })
  })

  return basins.reduce((acc, v) => acc * v, 1)
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
