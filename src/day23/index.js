const { read, send, test } = require('../utils')
const { solve1 } = require('./solution-1')
const { solve2 } = require('./solution-2')

const prepareInput1 = (rawInput) => rawInput.split('\n').map(l => l.split(''))

const goA1 = (rawInput) => {
  const board = prepareInput1(rawInput)
  
  const solves = []

  board.slice(2,4).forEach((l,i) => l.forEach((e,j) => {
    if (['A','B','C','D'].includes(e)) {
      solves.push({ t: e, s: false, i: i + 2, j })
    }
  }))

  return solve1(board, solves)
}

const prepareInput2 = (rawInput) => {
  const inp = rawInput.split('\n')
  const topRow = inp[2].split('').filter(c => c != '#').map(h => h.charCodeAt(0) - 64)
  const bottomRow = inp[3].trim().split('').filter(c => c != '#').map(h => h.charCodeAt(0) - 64)
  
  return Array.from(Array(topRow.length), (_, i) => [topRow[i], bottomRow[i]])
}

const goA2 = (rawInput) => {
  const rooms = prepareInput2(rawInput)

  return solve2(rooms)
}

const goB = (rawInput) => {
  const rooms = prepareInput2(rawInput)
  const extra = [[4,4], [3,2], [2,1], [1,3]]

  const roomsExtra = []
  rooms.forEach((l, i) => roomsExtra.push([l[0], ...extra[i], l[1]]))

  return solve2(roomsExtra)
}

/* Tests */

// test(goA(`rawInput`), expected)
// test(goB(`rawInput`), expected)

/* Results */
const input = read()

// console.time('Time')
// const resultA1 = goA1(input)
// console.timeEnd('Time')
// console.log('Solution to part 1 sol1:', resultA1)

console.time('Time')
const resultA2 = goA2(input)
console.timeEnd('Time')
console.log('Solution to part 1 sol2:', resultA2)

console.time('Time')
const resultB = goB(input)
console.timeEnd('Time')
console.log('Solution to part 2:', resultB)
