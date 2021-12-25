const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n').map(v => JSON.parse(v))

const explode = (str) => {
  let depth = 0

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') depth++
    else if (str[i] === ']') depth--
    else if (depth >= 5) {
      const [x, l, r] = str.slice(i).match(/(\d+),(\d+)/)
      
      const left = str
        .slice(0, i-1)
        .replace(/(\d+)(\D+)$/, (_, d, p) => `${+d + +l}${p}`)
      const right = str
        .slice(i + x.length + 1)
        .replace(/(\d+)/, (d) => `${+d + +r}`)
      
      return `${left}0${right}`
    }
  }

  return str
}

const split = (str) => 
  str.replace(
    /\d{2,}/, 
    (val) => JSON.stringify([
      Math.floor(+val / 2),
      Math.ceil(+val / 2)
    ])
  )

const reduceSnail = (snail) => {
  let str = JSON.stringify(snail)

  while (true) {
    const previous = str
    if ((str = explode(str)) !== previous) continue
    if ((str = split(str)) !== previous) continue
    return JSON.parse(previous)
  }
}

const magnitude = (snail) => {
  if (typeof snail === "number") return snail
  return 3 * magnitude(snail[0]) + 2 * magnitude(snail[1])
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const reducedSnail = input
    .slice(1)
    .reduce((r, snail) => reduceSnail([r, snail]), input[0])

  return magnitude(reducedSnail)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  let max = 0

  for(let y of input) {
    for (let x of input) {
      if (x == y) continue
      max = Math.max(max, magnitude(reduceSnail([x, y])))
    }
  }

  return max
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
