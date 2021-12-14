const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => 
    rawInput.split('\n\n').map((p, i) => {
      return i ?
        p.split('\n').map(v => {
          const [c, value] = v.split(' ')[2].split('=')
          return [c, Number(value)]
        }) :
        p.split('\n').map(v => {
          const [x,y] = v.split(',').map(Number)
          return {x, y} 
        })
    })

let paper = []

const preparePaper = (coords) => {
  const maxX = Math.max(...coords.map(v => v.x))
  const maxY = Math.max(...coords.map(v => v.y))

  paper = Array.from(Array(maxY + 1), () =>
    Array.from(Array(maxX + 1), () => '.')
  )

  coords.forEach(({x,y}) => paper[y][x] = '#')
}

const foldX = (value) => {
  const lastIndex = paper[0].length - 1

  console.log('X', value, paper[0].length, lastIndex)

  for (let y = 0; y < paper.length; y++) {
    for (let x = 0; x <= value; x++) {
      if (paper[y][x] === '.' && paper[y][lastIndex-x] === '#') paper[y][x] = '#'
    }
  }

  paper = paper.map(v => v.slice(0, value))
}

const foldY = (value) => {
  const lastIndex = paper.length - 1
  console.log('Y', value, paper[0].length, lastIndex)

  for (let y = 0; y <= value - 1; y++) {
    for (let x = 0; x < paper[y].length; x++) {
      if (paper[y][x] === '.' && paper[lastIndex - y][x] === '#') paper[y][x] = '#'
    }
  }

  paper = paper.slice(0, value -1)
}

const fold = (axis, value) => {
  axis === 'x' ? foldX(value) : foldY(value)
}

const goA = (rawInput) => {
  const [coords, foldValues] = prepareInput(rawInput)

  preparePaper(coords)

  fold(...foldValues[0])

  return paper.reduce((acc, l) => 
    acc + 
      l.reduce((acc2, v) => acc2 + (v === '#' ? 1 : 0), 0),
    0
  )
}

const goB = (rawInput) => {
  const [coords, foldValues] = prepareInput(rawInput)
  
  preparePaper(coords)
  console.log(paper[0].length, paper.length)

  foldValues.forEach(f => fold(...f))

  return paper.map(v => v.map(k => k === '#' ? '##': ('__')).join(' '))
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
