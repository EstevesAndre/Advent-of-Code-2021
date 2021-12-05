const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => {
  const output = rawInput
                  .split('\n')[0]
                  .split(',')
                  .map(Number)

  const boards = rawInput
                  .split('\n\n')
                  .slice(1)
                  .map(
                    board => board
                      .split('\n')
                      .map(
                        line => line
                          .trim()
                          .split(/\s+/)
                          .map(Number)
                      )
                  )

  return { output, boards }
}

const insertValues = (input, boardChecks, values = []) => {
  input.boards.forEach((board, bi) => {
    board.forEach((l, line) => {
      l.forEach((v, col) => {
        if (values.includes(v)) {
          boardChecks[bi][line][col] = true;
        }
      })
    })
  })
}

const checkWinBoard = (board) => {
  // line
  for (const l of board) {
    if (!l.join().includes("false")) return true
  }

  // column
  for(let i = 0; i < board[0].length; i++) {
    const aux = [];
    for(let j = 0; j < board.length; j++) {
      aux.push(board[j][i])
    }
    if (!aux.join().includes("false")) return true
  }

  return false
}

const checkWin = (boardChecks) => {
  for (const [bi, board] of boardChecks.entries()) {
    if (checkWinBoard(board)) {
      console.log(bi)
      return bi
    }
  }
  return -1
}

const checkWinLast = (boardChecks, boardsFinished, winningOrder) => {
  console.log(boardsFinished.size, winningOrder.length)
  for (const [bi, board] of boardChecks.entries()) {
    if (!boardsFinished.has(bi)) continue
    
    if (checkWinBoard(board)) {
      winningOrder.push(bi)
      boardsFinished.delete(bi)
      console.log(boardsFinished.size, winningOrder.length, bi)
    }
  }

}

const calculateScore = (input, boardChecks, boardIndex = 0, number = 0) => {
  let unmarkedSum = 0

  boardChecks[boardIndex].forEach((l, line) => {
    l.forEach((v, col) => {
      unmarkedSum += v ? 0 : input.boards[boardIndex][line][col];
    })
  })

  console.log(input.boards[boardIndex]);
  console.log(boardChecks[boardIndex]);
  
  console.log(unmarkedSum, number)
  return unmarkedSum * number
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput)

  input.output = [input.output.slice(0,6), ...input.output.slice(6)]
  const boardChecks = Array.from(
    Array(input.boards.length), () => 
      Array.from(Array(input.boards[0].length), () => 
        Array.from(Array(input.boards[0].length), () => false)
      )
  )

  for (const out of input.output) {
    insertValues(input, boardChecks, Array.isArray(out) ? out : [out])
    const winnerBoardIndex = checkWin(boardChecks)

    if (winnerBoardIndex !== -1) {
      return calculateScore(input, boardChecks, winnerBoardIndex, out)
    }
  }

  return "No Winner"
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput)

  const boardsFinished = new Set(Array.from(Array(input.boards.length), (_, i) => i))
  const winningOrder = []

  input.output = [input.output.slice(0,6), ...input.output.slice(6)]
  const boardChecks = Array.from(
    Array(input.boards.length), () => 
      Array.from(Array(input.boards[0].length), () => 
        Array.from(Array(input.boards[0].length), () => false)
      )
  )

  for (const out of input.output) {
    insertValues(input, boardChecks, Array.isArray(out) ? out : [out])

    checkWinLast(boardChecks, boardsFinished, winningOrder)

    if (boardsFinished.size === 0) {
      return calculateScore(input, boardChecks, winningOrder[winningOrder.length - 1], out)
    }
  }

  return "No Winner"
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
