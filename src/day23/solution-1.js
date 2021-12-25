let cache = {}
let minCost = Infinity

const amphipods = {
  A: { column: 3, energy: 1 },
  B: { column: 5, energy: 10 },
  C: { column: 7, energy: 100 },
  D: { column: 9, energy: 1000 },
}

const possibleColumns = [1,2,4,6,8,10,11]

const checkFinalState = (sol) => sol.filter(v => !v.s).length === 0

const getNewBoard = (board, piece, i, j) => {
  const newB = []
  board.forEach(l => newB.push([...l]))

  newB[piece.i][piece.j] = '.'
  newB[i][j] = piece.t

  return newB
}

const getNewSol = (sol, piece, index, i, j, s) => {
  const newSol = [...sol]
  newSol.splice(index, 1, {...piece, i, j, s})

  return newSol
}

const getPossibleMoves = (b, sol, cost) => {
  const newMoves = []

  const checkLine = [...b[1]]

  const isFree = (p) => p === '.'

  const addNewMove = (piece, index, i, j, destiny = false) => {
    newMoves.push({
      b: getNewBoard(b, piece, i, j),
      sol: getNewSol(sol, piece, index, i, j, destiny),
      cost: cost + (Math.abs(piece.j - j) + Math.abs(piece.i - i)) * amphipods[piece.t].energy
    })
  }

  for (const [index, piece] of sol.entries()) {
    if (piece.s || piece.i === 3 && !isFree(b[2][piece.j])) continue

    // check if outside and possible way to go to correct position
    if (piece.i === 1) {
      if (b[3][amphipods[piece.t].column] !== piece.t && !isFree(b[3][amphipods[piece.t].column]) ||
        b[2][amphipods[piece.t].column] !== piece.t && !isFree(b[2][amphipods[piece.t].column])) continue
      
      let path = []
      if (piece.j > amphipods[piece.t].column) path = checkLine.slice(amphipods[piece.t].column, piece.j)
      else path = checkLine.slice(piece.j + 1, amphipods[piece.t].column + 1)

      if (path.every(isFree)) {
        addNewMove(piece, index, isFree(b[3][amphipods[piece.t].column]) ? 3 : 2, [amphipods[piece.t].column], true)
      }

      continue
    }

    // in initial position and possible way to go to corridor left side
    for (let j = piece.j - 1; j > 0; j--) {
      if (possibleColumns.includes(j)) {
        if (isFree(checkLine[j])) addNewMove(piece, index, 1, j)
        else break
      }
    }

    // in initial position and possible way to go to corridor right side
    for (let j = piece.j + 1; j < b[0].length; j++) {
      if (possibleColumns.includes(j)) {
        if (isFree(checkLine[j])) addNewMove(piece, index, 1, j)
        else break
      }
    }
  }

  return newMoves
}

const game = (b, sol, cost = 0) => {
  if (cost >= minCost) return

  if (checkFinalState(sol)) {
    minCost = Math.min(minCost, cost)
    return
  }

  const boardCode = b.flat().join('')
  if (cache[boardCode]) {
    if (cache[boardCode] <= cost) return
  }
  cache[boardCode] = cost

  const newBoardStates = getPossibleMoves(b, sol, cost)

  for (let i = 0; i < newBoardStates.length; i++) {
    game(newBoardStates[i].b, newBoardStates[i].sol, newBoardStates[i].cost)
  }
}

const solve1 = (board, solves) => {
    game(board, solves)
    return minCost
}

module.exports = {
    solve1
}