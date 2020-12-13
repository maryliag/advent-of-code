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
            var occupied: number = countOccupied(map);
            applyRules(map);
            var occupiedUpdated: number = countOccupied(map);

            while (occupiedUpdated != occupied) {
                occupied = occupiedUpdated;
                applyRules(map);

                occupiedUpdated = countOccupied(map);
            }
            
            resolve(occupied);
        })
    }); 
};

function countOccupied(map:string[][]) {
    var occupied: number = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] == '#') occupied++;
        }
    }
    return occupied;
}

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

function countAdjacents(map:string[][], row, column) {
    var adj: number = 0;
    var rowsSize: number = map.length;
    var columnsSize: number = map[0].length;
    var rowAux: number = row;
    var columnAux: number = column;
    
    // Check same line left
    columnAux = column - 1;
    while (columnAux >= 0) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux] === 'E') {
            adj++;
            columnAux = -1;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            columnAux = -1;
        }
        columnAux--;
    }

    // Check same line right
    columnAux = column + 1;
    while (columnAux < columnsSize) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            columnAux = columnsSize;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            columnAux = columnsSize;
        }
        columnAux++;
    }

    // Check same column up
    columnAux = column;
    rowAux = row - 1;
    while (rowAux >= 0) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = -1;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = -1;
        }
        rowAux--;
    }

    // Check same column down
    rowAux = row + 1;
    while (rowAux < rowsSize) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = rowsSize;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = rowsSize;
        }
        rowAux++;
    }

    // Check diagonal left up
    columnAux = column - 1;
    rowAux = row - 1;
    while (rowAux >= 0 && columnAux >= 0) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = -1;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = -1;
        }
        rowAux--;
        columnAux--;
    }

    // Check diagonal right up
    columnAux = column + 1;
    rowAux = row - 1;
    while (rowAux >= 0 && columnAux < columnsSize) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = -1;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = -1;
        }
        rowAux--;
        columnAux++;
    }

    // Check diagonal right down
    columnAux = column + 1;
    rowAux = row + 1;
    while (rowAux < rowsSize && columnAux < columnsSize) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = rowsSize;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = rowsSize;
        }
        rowAux++;
        columnAux++;
    }

    // Check diagonal left down
    columnAux = column - 1;
    rowAux = row + 1;
    while (rowAux < rowsSize && columnAux >= 0) {
        if (map[rowAux][columnAux] === '#' || map[rowAux][columnAux]  === 'E') {
            adj++;
            rowAux = rowsSize;
        } else if (map[rowAux][columnAux] === 'L' || map[rowAux][columnAux] === 'O') {
            rowAux = rowsSize;
        }
        rowAux++;
        columnAux--;
    }

    return adj;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();