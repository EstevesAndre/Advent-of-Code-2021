const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => 
  rawInput.split('\n')
          .map(l => { 
            const s = l.split(' ')
            const [x1,x2, y1,y2, z1,z2] = s[1]
              .split(',')
              .map(c => c.split('=')[1].split('..').map(Number)).flat()

            return { on: s[0] === 'on', x1,x2, y1,y2, z1,z2 }
          })

const LIMIT = 50

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  const cubesOn = new Map()

  input.forEach(step => {
    const xMax = Math.min(step.x2, LIMIT),
        yMax = Math.min(step.y2, LIMIT),
        zMax = Math.min(step.z2, LIMIT)

    for(let x = Math.max(step.x1, -LIMIT); x <= xMax; x++) {
      let cubeX = cubesOn.has(x) ? cubesOn.get(x) : new Map()

      for(let y = Math.max(step.y1, -LIMIT); y <= yMax; y++) {
        let cubeY = cubeX.has(y) ? cubeX.get(y) : new Map()

        for(let z = Math.max(step.z1, -LIMIT); z <= zMax; z++) {
          if (step.on) {
            if (!cubeY.has(z)) cubeY.set(z, true)
          } else {
            if (cubeY.has(z)) cubeY.delete(z)
          }
        }

        cubeX.set(y, cubeY)
      }

      cubesOn.set(x, cubeX)
    }
  })

  const cubesOnCount = (() => {
    let count = 0
    cubesOn.forEach((y) => y.forEach(z => count += z.size))
    return count
  })()

  return cubesOnCount
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const regionsOverlap = (a, b) => 
    a.x1 <= b.x2 && b.x1 <= a.x2 &&
    a.y1 <= b.y2 && b.y1 <= a.y2 &&
    a.z1 <= b.z2 && b.z1 <= a.z2

  const splitCubes = (aCube, bCube) => {
    let cubes = []

    const addCube = (cubeInfo) => cubes.push({ on: true, ...cubeInfo })
    
    if (bCube.x1 > aCube.x1) addCube({ ...aCube, x2: bCube.x1 - 1 })
    if (bCube.x2 < aCube.x2) addCube({ ...aCube, x1: bCube.x2 + 1 })

    let middleX = { ...aCube, x1: Math.max(aCube.x1, bCube.x1), x2: Math.min(aCube.x2, bCube.x2)}
    if (bCube.y1 > aCube.y1) addCube({ ...middleX, y2: bCube.y1 - 1 })
    if (bCube.y2 < aCube.y2) addCube({ ...middleX, y1: bCube.y2 + 1 })

    let middleY = { ...middleX, y1: Math.max(aCube.y1, bCube.y1), y2: Math.min(aCube.y2, bCube.y2)}
    if (bCube.z1 > aCube.z1) addCube({ ...middleY, z2: bCube.z1 - 1 })
    if (bCube.z2 < aCube.z2) addCube({ ...middleY, z1: bCube.z2 + 1 })

    return cubes
  }

  const getArea = (cub) => (Math.abs(cub.x2-cub.x1) + 1) *
    (Math.abs(cub.y2-cub.y1) + 1) * (Math.abs(cub.z2-cub.z1) + 1)
  
  const solve = () => {
    let cubes = []

    for (let newCube of input) {
      let newCubes = []
      for (let oldCube of cubes) {
        if (regionsOverlap(oldCube, newCube)) {
          let cutCubes = splitCubes(oldCube, newCube)
          newCubes.push(...cutCubes)
        } else newCubes.push(oldCube)
      }

      if (newCube.on) newCubes.push(newCube)
      cubes = newCubes
    }

    return cubes.reduce((acc, cub) => acc + getArea(cub), 0)
  }

  return solve()
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
