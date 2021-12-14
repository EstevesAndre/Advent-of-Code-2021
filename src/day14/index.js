const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n\n').map((v,i) => i ? v.split('\n').map(x => x.split(' -> ')) : v.split(''))

const calcRange = (obj) => {
  let max = 0, min = Infinity

  Object.keys(obj).map(k => {
    const v = obj[k]
    if (v > max) max = v
    else if (v < min) min = v
  })

  return max - min
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  let polymer = input[0].slice()
  const processes = input[1].slice()

  const isValidInsertion = (index) => {
    const match = processes.filter(v => v[0][0] === polymer[index] && v[0][1] === polymer[index + 1])

    if (match.length) return match[0][1]

    return ''
  }

  const insert = (index, value) => polymer.splice(index, 0, value)
  
  const step = () => {
    let i = 0

    do {
      const ret = isValidInsertion(i)
      if (ret !== '') {
        insert(i + 1, ret)
        i++
      }

      i++
    } while (i + 1 < polymer.length)
  }

  for(let j = 0; j < 10; j ++) step()

  const counts = {}
  polymer.forEach(v => {
    if (counts[v]) counts[v]++
    else counts[v] = 1
  })

  return calcRange(counts)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const processes = {}, vowelCount = {}
  let pairs = {}
  
  input[1].map(v => processes[v[0]] = v[1])

  const addVowelCount = (vogal, count) => {
    if (vowelCount[vogal]) vowelCount[vogal] += count
    else vowelCount[vogal] = count
  }

  vowelCount[input[0][0]] = 1
  for(let i = 0; i < input[0].length - 1; i++) {
    const p = input[0][i] + input[0][i+1]
    if (pairs[p]) pairs[p]++
    else pairs[p] = 1

    addVowelCount(input[0][i+1], 1)
  }

  const step = () => {
    const toAdd = {}

    const addToNextObj = (k,v) => {
      if (toAdd[k]) toAdd[k] += v
      else toAdd[k] = v
    }
  
    Object.keys(pairs).map(key => {
      const newCh = processes[key]
      const value = pairs[key]

      addToNextObj(key[0] + newCh, value)
      addToNextObj(newCh + key[1], value)
      addVowelCount(newCh, value)
    })

    pairs = {...toAdd}
  }
  
  for(let j = 0; j < 40; j ++) step()

  return calcRange(vowelCount)
}

//  NBCCNBBBCBHCB
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
