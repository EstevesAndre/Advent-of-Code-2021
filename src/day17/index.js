const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput
  .split(', ')
  .map(v => {
    const [min,max] = v
    .split('=')[1]
    .split('..').map(Number)

    return {min,max}
  })

let [areaX, areaY] = [undefined, undefined]
let [velocityX, velocityY] = [undefined, undefined]
let pos = { x: 0, y: 0 }

const step = () => {
  pos.x += velocityX
  pos.y += velocityY

  if  (velocityX > 0) velocityX--
  else if  (velocityX < 0) velocityX++

  velocityY--
}

const setVelocity = (x,y) => {
  velocityX = x
  velocityY = y
}

const setPos = (x = 0,y = 0) => {
  pos.x = x
  pos.y = y
}

const checkOfLimits = () => {
  if (pos.x > areaX.max) return true
  if (pos.y < areaY.min && velocityY < 0) return true

  return false
}

const insideBoundaries = () => {
  if (pos.x < areaX.min || pos.x > areaX.max) return false
  if (pos.y < areaY.min || pos.y > areaY.max) return false

  return true
}

const calcBestValue = (v, i = 1) => {
  if (v - i < 0) return i

  return calcBestValue(v - i, i + 1)
}

const goA = (rawInput) => {
  [areaX, areaY] = prepareInput(rawInput)

  let checker = {maxY: -1}
  let maxY = 0

  for (let i = calcBestValue(areaX.min); i < calcBestValue(areaX.max); i++) {
    for (let j = 0; j < 250; j++) {
      setVelocity(i, j)
      setPos()
      maxY = j
      let prevPos = pos

      do {
        prevPos = {...pos}
        if (maxY < pos.y) maxY = pos.y
        step()
      } while (!checkOfLimits())

      pos = {...prevPos}

      if (insideBoundaries()) {
        if (checker.maxY < maxY) checker = {maxY, x: i, y: j}
      }
    }
  }

  return checker.maxY
}

const goB = (rawInput) => {
  [areaX, areaY] = prepareInput(rawInput)

  let count = 0

  for (let i = calcBestValue(areaX.min); i < 300; i++) {
    for (let j = -300; j < 300; j++) {
      setVelocity(i, j)
      setPos()
      let prevPos = pos

      do {
        prevPos = {...pos}
        step()
      } while (!checkOfLimits())

      pos = {...prevPos}

      if (insideBoundaries()) count++
    }
  }

  return count
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
