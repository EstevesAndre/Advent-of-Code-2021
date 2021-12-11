const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n')

const errorValue = { ')': 3, ']': 57, '}': 1197, '>': 25137 }
const isStart = (ch) => ['(', '[', '{', '<'].includes(ch)
const getOpposite = (ch) => {
  switch(ch) {
    case '(': return ')'
    case '[': return ']'
    case '{': return '}'
    case '<': return '>'
  }
  return ''
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  let count = 0

  for(let i = 0; i < input.length; i++) {
    const stack = []

    for(let c = 0; c < input[i].length; c++) {
      const ch = input[i][c]
      
      if (isStart(ch)) {
        stack.push(getOpposite(ch))
      } else {
        if (stack[stack.length-1] === ch) {
          stack.pop()
        } else {
          count += errorValue[ch]
          break
        }
      }
    }
  }

  return count
}

const incompleteValue = { ')': 1, ']': 2, '}': 3, '>': 4 }

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  let scores = []

  for(let i = 0; i < input.length; i++) {
    const stack = []

    for(let c = 0; c < input[i].length; c++) {
      const ch = input[i][c]
      
      if (isStart(ch)) {
        stack.push(getOpposite(ch))
      } else {
        if (stack[stack.length-1] === ch) {
          stack.pop()
        } else {
          break
        }
      }

      if (c + 1 === input[i].length) {
        let score = 0
        for(let j = stack.length - 1; j >= 0; j--) {
          score = score * 5 + incompleteValue[stack[j]]
        }
        scores.push(score)
      }
    }
  }

  return scores.sort((a,b) => b-a)[Math.floor(scores.length/2)]
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
