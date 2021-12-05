const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(coord => coord.split(' -> ').map(v => v.split(',').map(Number)))

const map = new Map()

const isHorizontal = (coord) => coord[0][0] === coord[1][0]
const isVertical = (coord) => coord[0][1] === coord[1][1]
const checkDecay = (coord) => {
  if (coord[0][0] < coord[1][0]) return coord[0][1] < coord[1][1]
  else return coord[1][1] < coord[0][1]
}
const addCoord = (x, y) => {
  const key = `${x},${y}`
  if (map.has(key)) {
    map.set(key, true)
    return
  }

  map.set(key, false)
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)
  map.clear()

  input.forEach(coord => {
    if (isHorizontal(coord)) {
      const min = Math.min(coord[0][1], coord[1][1])
      const max = Math.max(coord[0][1], coord[1][1])

      for (let i = min; i <= max; i++) addCoord(coord[0][0], i)
    } else if (isVertical(coord)) {
      const min = Math.min(coord[0][0], coord[1][0])
      const max = Math.max(coord[0][0], coord[1][0])

      for (let i = min; i <= max; i++) addCoord(i, coord[0][1])
    }
  })
  
  return Array.from(map.values()).reduce((acc, v) => acc + (v ? 1:0))
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)
  map.clear()

  input.forEach(coord => {
    if (isHorizontal(coord)) {
      const min = Math.min(coord[0][1], coord[1][1])
      const max = Math.max(coord[0][1], coord[1][1])

      for (let i = min; i <= max; i++) addCoord(coord[0][0], i)
    } else if (isVertical(coord)) {
      const min = Math.min(coord[0][0], coord[1][0])
      const max = Math.max(coord[0][0], coord[1][0])

      for (let i = min; i <= max; i++) addCoord(i, coord[0][1])
    } else {
      const minX = Math.min(coord[0][0], coord[1][0])
      const count = Math.max(coord[0][0], coord[1][0]) - minX
      
      const yDirection = checkDecay(coord) ? 1 : -1
      const minY = yDirection === 1 ? Math.min(coord[0][1], coord[1][1]) : Math.max(coord[0][1], coord[1][1])
      
      for (let i = 0; i <= count; i++) addCoord(minX + i, minY + i * yDirection)
    }
  })
  
  return Array.from(map.values()).reduce((acc, v) => acc + (v ? 1:0))
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
