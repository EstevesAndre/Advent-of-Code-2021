const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(l => l.split('').map(Number))

const cost = (input) => {
  const visited = new Set()
  const queue = [{ x: 0, y: 0, acc: 0}]

  const possibleMoves = ({x, y, acc}) => {
    const pmoves = []
    
    if (x != 0) pmoves.push({x: x - 1, y, acc: acc + input[y][x - 1]})
    if (y != 0) pmoves.push({x, y: y - 1, acc: acc + input[y - 1][x]})
    if (x < input[0].length - 1) pmoves.push({x: x + 1, y, acc: acc + input[y][x + 1]})
    if (y < input.length - 1) pmoves.push({x, y: y + 1, acc: acc + input[y + 1][x]})

    pmoves.forEach(v => queue.push(v))
    queue.sort((a,b) => a.acc - b.acc)
  }

  while (queue.length) {
    const curr = queue.shift();
    const code = `${curr.x},${curr.y}`
    
    if (visited.has(code)) continue
    visited.add(code)

    if (curr.x === input[0].length - 1 && curr.y === input.length - 1) return curr.acc
    possibleMoves(curr)
  }

  return -1
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  return cost(input)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const recreate = (sum) => {
    var cpy = [];
    for (var i = 0; i < input.length; i++)
      cpy.push([...input[i]])
    
    return cpy.map(l => l.map(v => (v + sum - 1) % 9 + 1 ))
  }

  const newInput = Array.from(Array(input.length * 5), () => new Array(input[0].length * 5))

  input.forEach((line,l) => {
    line.forEach((_,v) => {
      for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 5; i++) {
          newInput[j * input.length + l][i * input[i].length + v] = (input[l][v] + j + i - 1) % 9 + 1
        }
      }
    })
  })

  return cost(newInput)
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
