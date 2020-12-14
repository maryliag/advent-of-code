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
            if (map[i][j] === '#' && countAdjacents(map, i, j) >= 4) {
                map[i][j] = 'E';
            }
        }
    }
    
    // After all rules are applied, change the pending state to the final states
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 'O') map[i][j] = '#';
            if (map[i][j] === 'E') map[i][j] = 'L';
        }
    }
}

function countAdjacents(map:string[][], i, j) {
    var adj: number = 0;
    var rows: number = map.length;
    var columns: number = map[0].length;
    var pos: object[] = [];
    
    // Create list of all positions surrounding the position being checked
    for (let ii = -1; ii <= 1; ii++) {
        for (let jj = -1; jj <= 1; jj++) {
            if (ii === 0 && jj === 0) continue;
            let newPos: object = {i: i + ii, j: j + jj};
            if (newPos['i'] >= 0 && newPos['i'] < rows && newPos['j'] >= 0 && newPos['j'] < columns) {
                pos.push(newPos);
            }
        }
    }
    
    // Count occupied seats on the surrounding seats
    for (let index = 0; index < pos.length; index++) {
        if (map[pos[index]['i']][pos[index]['j']] === '#' || map[pos[index]['i']][pos[index]['j']] === 'E') {
            adj++;
        }
    }
    return adj;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();