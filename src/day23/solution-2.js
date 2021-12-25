const checkIfValidRoom = (room, amphipod) => room.every(x => x === amphipod || x === 0)

const checkFinalState = (rooms) => rooms.every((room, i) => room.every(r => r === (i + 1)))

const getNewMove = (rooms, hallway, energyCost, moved, amphipod, topIndex, i, j) => {
    const newRooms = JSON.parse(JSON.stringify(rooms))
    const newHallway = [...hallway]
    const newEnergyCost = energyCost + moved * (10 ** (amphipod-1))
    newHallway[j] = newRooms[i][topIndex]
    newRooms[i][topIndex] = 0

    return [newRooms, newHallway, newEnergyCost]
}

const solve2 = (initialRoomState) => {
    const initialHallway = [0,0,0,0,0,0,0]
    const size = initialRoomState[0].length
    let cache = {}, minEnergy = Infinity

    const moveState = (rooms, hallway, energyCost) => {
        // more costly solution
        if (energyCost >= minEnergy) return

        // is final state change min used
        if (checkFinalState(rooms)) {
            minEnergy = Math.min(minEnergy, energyCost)
            return
        }
        
        const key = rooms.flat().join('') + '-' + hallway.join('')
        if (cache[key]) {
            if (cache[key] <= energyCost) return
        }
        cache[key] = energyCost

        for (const [i, room] of rooms.entries()) {
            const topIndex = room.findIndex(r => r != 0)
            if (topIndex === -1) continue
            
            const amphipod = room[topIndex]
            // check in correct position
            if (amphipod === i + 1 && checkIfValidRoom(room, amphipod)) continue

            let moved = topIndex

            for (let j = i + 1; j >= 0; j--) {
                if (hallway[j] != 0) break
                moved = j != 0 ? moved + 2 : moved + 1
                
                moveState(...getNewMove(rooms,hallway,energyCost, 
                    moved, amphipod, topIndex, i, j))
            }

            moved = topIndex
            for (let j = i + 2; j < hallway.length; j++) {
                if (hallway[j] != 0) break
                moved = j != hallway.length - 1 ? moved + 2 : moved + 1

                moveState(...getNewMove(rooms,hallway,energyCost, 
                    moved, amphipod, topIndex, i, j))
            }
        }

        hallwayLoop:
        for (const [i, hall] of hallway.entries()) {
            if (hall == 0 || !checkIfValidRoom(rooms[hall-1], hall)) continue
            
            let moved = 2
            if (i < hall) {
                for (let j = i + 1; j <= hall; j++) {
                    if (hallway[j] != 0) continue hallwayLoop
                    moved = j != 1 ? moved + 2 : moved + 1
                }
            }
            if (i > hall + 1) {
                for (let j = i - 1; j >= hall + 1; j--) {
                  if (hallway[j] != 0) continue hallwayLoop
                  moved = j != hallway.length-2 ? moved + 2 : moved + 1
                }
            }

            let topIndex = rooms[hall - 1].findIndex(x => x != 0)
            topIndex = (topIndex === - 1 ? size  : topIndex) - 1
            moved += topIndex

            const newRooms = JSON.parse(JSON.stringify(rooms))
            const newHallway = [...hallway]
            const newEnergyCost = energyCost + moved * (10 ** (hall-1))
            newRooms[hall - 1][topIndex] = hall
            newHallway[i] = 0

            moveState(newRooms, newHallway, newEnergyCost)
        }

        return minEnergy
    }
    
    return moveState(initialRoomState, initialHallway, 0)
}

module.exports = {
    solve2
}