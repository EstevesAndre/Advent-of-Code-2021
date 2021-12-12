const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(c => c.split('-'))
const graph = new Map()
const START = 'start', END = 'end'
let pathsCount

const isUpperCase = (str) => str === str.toUpperCase()

const buildGraph = (data) => {
  const addPath = (a, b) => {
    if (graph.has(a)) graph.set(a, graph.get(a).add(b))
    else graph.set(a, new Set().add(b))
  }

  data.forEach(con => {
    addPath(...con)    
    addPath(...con.reverse())    
  })
}

const findPath = (node, visited = [], passTwice = false) => {
  if (visited.includes(END)) return

  if (node === END) {
    visited.push(END)
    pathsCount++
    return
  }

  if (!passTwice && !isUpperCase(node) && visited.includes(node)) return
  
  visited.push(node)
  let counts = {}

  // Check for second cavern
  if (passTwice) {
    visited.forEach(v => {
      if (v !== START && !isUpperCase(v)) {
        if (!counts[v]) counts[v] = 1
        else counts[v]++
      }
    })
  
    if (Object.values(counts).filter(v => v == 2).length > 1) return
  }

  graph.get(node).forEach((out) => {
    if (!passTwice || out !== START && counts[out] != 2) findPath(out, [...visited], passTwice)
  })
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)
  pathsCount = 0

  buildGraph(input)
  findPath(START)
  
  return pathsCount
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)
  pathsCount = 0

  buildGraph(input)
  findPath(START, [], true)

  return pathsCount
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
