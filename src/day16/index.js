const { read, send, test } = require('../utils')

const prepareInput = (rawInput) => rawInput
let count = 0
const getBinary = (hex) => {
  switch(hex) {
    case '0': return '0000'
    case '1': return '0001'
    case '2': return '0010'
    case '3': return '0011'
    case '4': return '0100'
    case '5': return '0101'
    case '6': return '0110'
    case '7': return '0111'
    case '8': return '1000'
    case '9': return '1001'
    case 'A': return '1010'
    case 'B': return '1011'
    case 'C': return '1100'
    case 'D': return '1101'
    case 'E': return '1110'
    case 'F': return '1111'
  }
}

const getPacketVersion = (bin) => parseInt(bin.substr(0,3), 2)

const getTypeID = (bin) => parseInt(bin.substr(3,3), 2)

const getLiteralValue = (bin) => {
  const info = {}

  let literal = '', bits = ''
  do {
    bits = bin.substr(0, 5)
    bin = bin.substr(5)
    literal += bits.substr(1, 4) + ''
  } while (bits[0] === '1')
  
  info.literalValue = parseInt(literal, 2)
  info.bin = bin
  if (count === 6) console.log(count)
  return info
}

const getOperatorElements = (bin) => {
  const info = {}
  info.lengthTypeID = parseInt(bin[0], 2)

  if (info.lengthTypeID === 0) {
    info.totalLengthInBits = parseInt(bin.substr(1,15), 2)
    bin = bin.substr(16)
    info.subPackets = []
    let sum = 0

    do {
      const newSubPacket = getPacketInformation(bin)
      sum += bin.length - newSubPacket.packetValue.bin.length
      bin = newSubPacket.packetValue.bin
      info.subPackets.push(newSubPacket)
    } while(sum !== info.totalLengthInBits)
  } else {
    info.numberOfSubPackets = parseInt(bin.substr(1,11), 2)
    bin = bin.substr(12)
    info.subPackets = []

    for (let i = 0; i < info.numberOfSubPackets; i++) {
      const newSubPacket = getPacketInformation(bin)
      bin = newSubPacket.packetValue.bin
      info.subPackets.push(newSubPacket)
    }
  }
  info.bin = bin



  return info
}

const calcPacketSum = (packet) => {
  packet.literalValue = packet.subPackets.reduce((acc, v) => acc + v.packetValue.literalValue, 0)
  return packet
}
const calcPacketProduct = (packet) => {
  packet.literalValue = packet.subPackets.reduce((acc, v) => acc * v.packetValue.literalValue, 1)
  return packet
}
const calcPacketMinimum = (packet) => {
  packet.literalValue = Math.min(
        ...packet
        .subPackets
        .map((p) => p.packetValue.literalValue))

  return packet
}
const calcPacketMaximum = (packet) => {
  packet.literalValue = Math.max(
        ...packet
        .subPackets
        .map((p) => p.packetValue.literalValue))

  return packet
}
const calcPacketGreater = (packet) => {
  const values = packet.subPackets
        .map((p) => p.packetValue.literalValue)
  
  packet.literalValue = values[0] > values[1] ? 1:0

  return packet
}
const calcPacketLess = (packet) => {
  const values = packet.subPackets
        .map((p) => p.packetValue.literalValue)
  
  packet.literalValue = values[0] < values[1] ? 1:0

  return packet
}
const calcPacketEqual = (packet) => {
  const values = packet.subPackets
        .map((p) => p.packetValue.literalValue)
  
  packet.literalValue = values[0] === values[1] ? 1:0

  return packet
}

const getPacketValue = (bin, typeID) => {
  if (typeID === 4) return getLiteralValue(bin)

  const newPacketElements = getOperatorElements(bin)
  
  switch (typeID) {
    case 0: return calcPacketSum(newPacketElements)
    case 1: return calcPacketProduct(newPacketElements)
    case 2: return calcPacketMinimum(newPacketElements)
    case 3: return calcPacketMaximum(newPacketElements)
    case 5: return calcPacketGreater(newPacketElements)
    case 6: return calcPacketLess(newPacketElements)
    case 7: return calcPacketEqual(newPacketElements)
  }
}

const getPacketInformation = (bin) => {
  const info = {}

  info.packetVersion = getPacketVersion(bin)
  info.typeID = getTypeID(bin)
  info.packetValue = getPacketValue(bin.substr(6), info.typeID)

  return info
}

const getSumVersionNumber = (info) => {

  if (info.typeID === 4) return info.packetVersion

  let partialSum = 0
  info.packetValue
      .subPackets
      .forEach(subPacket => partialSum += getSumVersionNumber(subPacket))

  return info.packetVersion + partialSum
}

const goA = (rawInput) => {
  const input = prepareInput(rawInput).split('')

  const binaryString = input.map((hex) => getBinary(hex)).join('')
  const info = getPacketInformation(binaryString)

  return getSumVersionNumber(info)
}

const goB = (rawInput) => {
  const input = prepareInput(rawInput).split('')

  const binaryString = input.map((hex) => getBinary(hex)).join('')
  const info = getPacketInformation(binaryString)

  return info.packetValue.literalValue
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
