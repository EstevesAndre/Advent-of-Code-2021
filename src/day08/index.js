const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput
                                    .split('\n')
                                    .map(l => {
                                      const [input, output] = l.split('|').map(p => p.trim().split(' '))

                                      const sortElems = (values) => values.map(v => v.split('').sort((a,b) => a.localeCompare(b)).join(''))

                                      return {
                                        input: sortElems(input),
                                        output: sortElems(output),
                                      }
                                    })

const goA = (rawInput) => {
  const input = prepareInput(rawInput)
  const uniqueLogicCounts = [2, 4, 3, 7]

  return input.reduce((acc, entry) => 
    acc + entry.output.reduce((acc2, v) => acc2 + uniqueLogicCounts.includes(v.length), 0),
    0
  )
}

const containsAll = (elem, check) => check.split('').every(v => elem.includes(v))

const getOutputValue = (input, output) => {
  const findMatch = (fil) => input.filter(fil)[0]

  const matchs = new Map()
  matchs.set(1, findMatch(elem => elem.length === 2))
  matchs.set(7, findMatch(elem => elem.length === 3))
  matchs.set(4, findMatch(elem => elem.length === 4))
  matchs.set(8, findMatch(elem => elem.length === 7))

  matchs.set(9, findMatch(elem => elem.length === 6 && containsAll(elem, matchs.get(4))))
  matchs.set(6, findMatch(elem => elem.length === 6 && !containsAll(elem, matchs.get(1))))
  matchs.set(0, findMatch(elem => elem.length === 6 && containsAll(elem, matchs.get(1)) && !containsAll(elem, matchs.get(9))))

  matchs.set(3, findMatch(elem => elem.length === 5 && containsAll(elem, matchs.get(1))))
  matchs.set(5, findMatch(elem => elem.length === 5 && !containsAll(elem, matchs.get(1)) && containsAll(matchs.get(9), elem)))
  matchs.set(2, findMatch(elem => elem.length === 5 && !containsAll(elem, matchs.get(1)) && !containsAll(elem, matchs.get(5))))

  const mapToInteger = new Map()
  Array.from(Array(10), (_, i) => i).forEach((key) => {
    mapToInteger.set(matchs.get(key), key)
  })

  return output.reduce((acc, v, i) => acc + mapToInteger.get(v) * Math.pow(10, (3 - i)),0)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  return input.reduce((acc, elem) => acc + getOutputValue(elem.input, elem.output), 0)
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
