require('dotenv').config()

const test = require('./test')
const { readInput } = require('./readInput')
const { sendSolution } = require('./api')
const getCallerFile = require('get-caller-file')

const log = (data) => console.dir(data, { colors: true, depth: 99 })
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const day = process.argv[2] ? Number(process.argv[2]) : null

const send = (part, solution) => {
  sendSolution(`${process.env.YEAR}`, day, part, solution)
}

const read = () => readInput(getCallerFile(), day)

module.exports = {
  read,
  send,
  log,
  delay,
  test,
  readInput,
  sendSolution,
}
