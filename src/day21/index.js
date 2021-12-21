const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput
  .split('\n')
  .map(l => Number(l.substr(l.indexOf(':') + 1)))


const SCORE_P1 = 1000, SCORE_P2 = 21
let scores, players, boardSize, playerTurnIndex, roles

const reset = () => {
  scores = [0, 0]
  players = [-1, -1]
  boardSize = 10
  playerTurnIndex = 0
  roles = 0
}

const getDiceRollsCount = (ftn = () => Math.floor(Math.random() * 6 + 1)) => Array.from(Array(3), ftn).reduce((acc, v) => acc + v, 0)
const deterministic = (function() { return () =>  roles++ % 100 + 1; }(0));

const turn = (ftn) => {
  const newSum = players[playerTurnIndex] + getDiceRollsCount(ftn)
  const newPos = newSum % boardSize ? newSum % boardSize : boardSize

  players[playerTurnIndex] = newPos
  scores[playerTurnIndex] += newPos
  playerTurnIndex = playerTurnIndex ? 0:1
}

const goA = (rawInput) => {
  reset()
  prepareInput(rawInput).forEach((v,i) => players[i] = v)

  do {
    turn(deterministic)
  } while (Math.max(...scores) < SCORE_P1)

  return roles * Math.min(...scores)
}

const goB = (rawInput) => {
  reset()
  prepareInput(rawInput).forEach((v,i) => players[i] = v)

  const memoizedWins = {}

  const doTurn = (p1, p2, s1, s2) => {
    if (s2 >= SCORE_P2) return [0, 1]
    
    const id = `${p1},${p2},${s1},${s2}`;
    if (memoizedWins[id]) return memoizedWins[id]

    const mockArray = Array.from(Array(3), (_, i) => i + 1)
    const result = [0, 0];

    mockArray.forEach((die1) => {
      mockArray.forEach((die2) => {
        mockArray.forEach((die3) => {
          let n1 = (((p1 + die1 + die2 + die3) - 1) % 10) + 1;

          let wins = doTurn(p2, n1, s2, s1 + n1);
          result[0] += wins[1];
          result[1] += wins[0];
        })
      })
    })

    memoizedWins[id] = result;
    return result;
  }

  return Math.max(...doTurn(...players, 0, 0))
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
