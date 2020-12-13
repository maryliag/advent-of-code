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
            if (map[i][j] === '#' && countAdjacents(map, i, j) >= 4) {
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

function countAdjacents(map:string[][], i, j) {
    var adj: number = 0;
    var rows: number = map.length;
    var columns: number = map[0].length;
    var pos: object[] = [];
    
    pos.push({i: i, j: j - 1}); pos.push({i: i - 1, j: j - 1}); pos.push({i: i - 1, j: j}); pos.push({i: i - 1, j: j + 1});
    pos.push({i: i, j: j + 1}); pos.push({i: i + 1, j: j + 1}); pos.push({i: i + 1, j: j}); pos.push({i: i + 1, j: j - 1});
    
    for (let index = 0; index < pos.length; index++) {
        if (pos[index]['i'] >= 0 && pos[index]['i'] < rows && pos[index]['j'] >= 0 && pos[index]['j'] < columns) {
            if (map[pos[index]['i']][pos[index]['j']] === '#' || map[pos[index]['i']][pos[index]['j']] === 'E') {
                adj++;
            }
        }
    }
    return adj;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();