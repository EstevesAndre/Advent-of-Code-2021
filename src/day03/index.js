const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput.split('\n')

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const middle = input.length / 2
  let bits = Array.from(Array(input[0].length), () => -middle)

  input.forEach(gamma => {
    bits = bits.map((bit, i) => bit + Number(gamma[i]))
  })

  const mcv = parseInt(bits.map(v => v > 0 ? 1:0).join(""), 2)
  const lcv = parseInt(bits.map(v => v > 0 ? 0:1).join(""), 2)
  
  return mcv * lcv
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const runs = input[0].length
  const oxyRat = { current: input, 0: [], 1: [] }
  const co2Rat = { current: input, 0: [], 1: [] }

  const clean = (op1, op2) => {
    oxyRat.current = op1 ? oxyRat["1"] : oxyRat["0"]
    oxyRat["0"] = []
    oxyRat["1"] = []

    co2Rat.current = op2 ? co2Rat["0"] : co2Rat["1"]
    co2Rat["0"] = []
    co2Rat["1"] = []
  }

  let oxyValue = 0, co2Value = 0

  for(let i = 0; i < runs; i++) {
    oxyRat.current.forEach(v => oxyRat[v[i]].push(v))
    co2Rat.current.forEach(v => co2Rat[v[i]].push(v))

    clean(
      oxyRat["1"].length >= oxyRat["0"].length || oxyRat["1"].length === 1,
      co2Rat["0"].length <= co2Rat["1"].length || co2Rat["0"].length === 1,
    )

    if (oxyRat.current.length === 1) oxyValue = oxyRat.current[0]
    if (co2Rat.current.length === 1) co2Value = co2Rat.current[0]

    if (oxyValue !== 0 && co2Value !== 0) break;
  }

  return parseInt(oxyValue, 2) * parseInt(co2Value, 2)
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
