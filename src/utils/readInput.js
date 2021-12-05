require('dotenv').config()

const { readFileSync, existsSync } = require('fs')
const { sep } = require('path')
const { getInput } = require('./api')

const readInput = (caller, day) => {
  const file = caller.split(sep).slice(0, -1).concat('input.txt').join(sep)

  if (day !== null) {
    getInput(`${process.env.YEAR}`, day, file)
  }

  if (existsSync(file)) {
    return readFileSync(file).toString()
  } else {
    console.error('No input file')
  }
}

module.exports = { readInput }
