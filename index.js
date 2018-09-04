const { Map, List } = require('immutable')
/*
const map1 = Map({ a: 1, b: 2, c: 3 })
const map2 = map1.set('b', 50)
console.log(map1.get('b') + " vs. " + map2.get('b')) // 2 vs. 50
*/

//console.log(4)


const initialBoard = Map({
    1: Map({pegged: false, connections: Map({6: "3", 4: "2"})}),
    2: Map({pegged: true, connections: Map({9: "5", 7: "4"})}),
    3: Map({pegged: true, connections: Map({10: "6", 8: "5"})}),
    4: Map({pegged: true, connections: Map({13: "8", 11: "7", 6: "5", 1: "2"})}),
    5: Map({pegged: true, connections: Map({14: "9", 12: "8"})}),
    6: Map({pegged: true, connections: Map({15: "10", 13: "9", 4: "5", 1: "3"})}),
    7: Map({pegged: true, connections: Map({9: "8", 2: "4"})}),
    8: Map({pegged: true, connections: Map({10: "9", 3: "5"})}),
    9: Map({pegged: true, connections: Map({7: "8", 2: "5"})}),
    10: Map({pegged: true, connections: Map({8: "9", 3: "6"})}),
    11: Map({pegged: true, connections: Map({13: "12", 4: "7"})}),
    12: Map({pegged: true, connections: Map({14: "13", 5: "8"})}),
    13: Map({pegged: true, connections: Map({15: "14", 11: "12", 6: "9", 4: "8"})}),
    14: Map({pegged: true, connections: Map({12: "13", 5: "9"})}),
    15: Map({pegged: true, connections: Map({13: "14", 6: "10"})}),
})

function isPegged(board, pos) {
    return board.getIn([pos, "pegged"])
}

function removePeg(board, pos) {
    return board.setIn([pos, "pegged"], false)
}

function placePeg(board, pos) {
    return board.setIn([pos, "pegged"], true)
}

function movePeg(board, from, to) {
    return placePeg(removePeg(board, from), to)
}

function getValidMoves(board, pos) {
    return board.getIn([pos, "connections"])
        .filter((mediate, dest) => !isPegged(board, dest) && isPegged(board, mediate))
}

function isValidMove(board, from, to) {
    return getValidMoves(board, from).get(to)
}

function makeMove(board, from, to) {
    const mediate = isValidMove(board, from, to)
    if (mediate) {
        return movePeg(board, from, to)
    }
}

const test = movePeg(initialBoard, "4", "1")

/*function getAllValidMoves(board) {
    const connectionsOfHoles = initialBoard.filter(v => !v.get("pegged"))
        .valueSeq()
        .toSet()
        .map(o => o.get("connections"))
    const moves = connectionsOfHoles.flatMap(v => v.keySeq().toSet())
    console.log(moves.map(e => Map({[e]: getValidMoves(board, e)})).filter(v => v.isEmpty))
}
console.log(getAllValidMoves(initialBoard))
*/

/**
 * 
 * @param {Board} board
 * @returns {Array} Array of [to, from, mediate] 
 */
function getAllValidMoves(board) {
    return board.filter(v => !v.get("pegged"))
        .map(v => v.get("connections").filter((v, k) => isPegged(board, v) && isPegged(board, k)))
        .map((frommediate, to) => [...frommediate.entries()].map(e => [to, ...e]))
        .valueSeq()
        .flatMap(v => v)
        .toArray()        
}

console.log(getAllValidMoves(initialBoard))
//console.log(getAllValidMoves(initialBoard).get("2"))

/*const testMap = Map({"1":"2", "3":"4"})
console.log([...testMap.entries()])*/

function pegsCount(board) {
    return initialBoard.filter(v => v.get("pegged")).count()
}

function makeMove(board, [to, from, mediate]) {
    return removePeg(movePeg(board, from, to), mediate)
}

function logic(board, moveSeq = List()) {
    const moves = getAllValidMoves(board)
    if (!moves.length) {
        if (pegsCount(board) == 1) {
            return moveSeq;
        }
        return false;
    }
    const seq = moves.find(m => logic(makeMove(board, m), moveSeq.push([m[1], m[0]])))
    if (seq) {
        return seq
    } else {
        return false
    }
}

console.log(logic(initialBoard))