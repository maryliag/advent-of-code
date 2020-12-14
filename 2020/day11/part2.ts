import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var map: string[][] = [];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            map.push(l.split(''));
        })
        .on('close', function (err) {
            var before: string = map.toString();
            applyRules(map);
            var after: string = map.toString();

            // Keep applying rules until there is no changing on the seating area
            while (after != before) {
                before = after;
                applyRules(map);
                after = map.toString();
            }
            
            resolve(countOccupied(map));
        })
    }); 
};

// Count total of occupied seats on the seating area
function countOccupied(map:string[][]) {
    var occupied: number = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] == '#') occupied++;
        }
    }
    return occupied;
}

// Apply all rules simultaneously
// Create a pending state for seats to be occupied that are current free (O) and for seat current occupied that will be empty (E)
// This is done so no changes in one seat alters the value for the next without the next being calculated
function applyRules(map:string[][]) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 'L' && countAdjacents(map, i, j) === 0) {
                map[i][j] = 'O';
            }
            if (map[i][j] === '#' && countAdjacents(map, i, j) >= 5) {
                map[i][j] = 'E';
            }
        }
    }
    
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 'O') map[i][j] = '#';
            if (map[i][j] === 'E') map[i][j] = 'L';
        }
    }
}

// Check if is occupied or on the pending state that will be empty (meaning currently still occupied)
function foundOccupied(map:string[][], row: number, column: number) {
    return map[row][column] === '#' || map[row][column] === 'E';
}

// Check if is empty or on the pending state that will be occupied (meaning currently still empty)
function foundEmpty(map:string[][], row: number, column: number) {
    return map[row][column] === 'L' || map[row][column] === 'O';
}

// Return true if the first seats it finds is occupied
function isFirstSeatOccupied(map:string[][], rowStart: number, columnStart: number, rowAdd: number, columnAdd: number) {
    // Keep moving until is no longer a valid seat (not on the seating area) or found a seat
    while (rowStart >= 0 && columnStart >= 0 && rowStart < map.length && columnStart < map[0].length) {
        if (foundOccupied(map, rowStart, columnStart)) {
            return true;
        } else if (foundEmpty(map, rowStart, columnStart)) {
            return false;
        }
        rowStart += rowAdd;
        columnStart += columnAdd;
    }

    return false;
}

function countAdjacents(map:string[][], row: number, column: number) {
    var adj: number = 0;
    
    // Check same line left
    if (isFirstSeatOccupied(map, row, column - 1, 0, -1)) adj++;

    // Check same line right
    if (isFirstSeatOccupied(map, row, column + 1, 0, 1)) adj++;

    // Check same column up
    if (isFirstSeatOccupied(map, row - 1, column, -1, 0)) adj++;

    // Check same column down
    if (isFirstSeatOccupied(map, row + 1, column, 1, 0)) adj++;

    // Check diagonal left up
    if (isFirstSeatOccupied(map, row - 1, column - 1, -1, -1)) adj++;

    // Check diagonal right up
    if (isFirstSeatOccupied(map, row - 1, column + 1, -1, 1)) adj++;

    // Check diagonal right down
    if (isFirstSeatOccupied(map, row + 1, column + 1, 1, 1)) adj++;

    // Check diagonal left down
    if (isFirstSeatOccupied(map, row + 1, column - 1, 1, -1)) adj++;

    return adj;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();