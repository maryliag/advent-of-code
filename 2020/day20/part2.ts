import * as fs from 'fs';
import * as rd from 'readline'

class Tile {
    id: string;
    map: string[][];
    borders: string[][];
    matches: string[][];

    // border and match index 
    // 0: top, 1: right, 2: bottom, 3: left
    constructor (id: string) {
        this.id = id;
        this.map = [];
        this.matches = [[], [], [], []];
    }

    // Create a string with all border to facilitate comparisons
    initializeBorders() {
        this.borders = [[...this.map[0]], [], [...this.map[this.map.length - 1]], []];
        for (let i = 0; i < this.map.length; i++) {
            this.borders[1].push(this.map[i][this.map[i].length - 1]);
            this.borders[3].push(this.map[i][0]);
        }
    }
}

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allTiles: object = {};
    let tile: Tile;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.includes('Tile')) {
                tile = new Tile(l.split(' ')[1].split(':')[0]);
            } else if (l.length === 0) {
                tile.initializeBorders();
                allTiles[tile.id] = tile;
            } else {
                tile.map.push(l.split(''));
            }
        })
        .on('close', function (err) {
            tile.initializeBorders();
            allTiles[tile.id] = tile;
            allTiles = findMatches(allTiles);
            let map: string[][] = createMap(allTiles);
            let monsters: number = countMonsters(map);

            resolve(countRoughWater(map, monsters));
        })
    }); 
};

function findMatches(allTiles: object) {
    var tileIds = Object.keys(allTiles);
    for (let i = 0; i < tileIds.length; i++) {
        const tile = allTiles[tileIds[i]];
        for (let j = i + 1; j < tileIds.length; j++) {
            const possibleTile = allTiles[tileIds[j]];
            if (tile.id == possibleTile.id) continue;

            // For each tile, look into all others that weren't checked yet if any of the borders (or its reverse) match
            // If they do, update both the current tile and the possible match
            for (let k = 0; k < tile.borders.length; k++) {
                for (let l = 0; l < possibleTile.borders.length; l++) {
                    let aux: string[] = possibleTile.borders[l];
                    if (tile.borders[k].toString() == aux.toString() ||
                        tile.borders[k].toString() == aux.reverse().toString()) {
                        tile.matches[k].push(possibleTile.id);
                        possibleTile.matches[l].push(tile.id);
                    }
                }
            }
        }  
    }
    return allTiles;
}

function createMap(allTiles: object) {
    var tileIds = Object.keys(allTiles);
    var map: string[][][] = [];
    var firstTile: Tile;

    // Find the first corner, where there are no matches on the top and the left
    // Rotate the tile if necessary
    for (let i = 0; i < tileIds.length; i++) {
        let matches: number = 0;
        for (let index = 0; index < allTiles[tileIds[i]].matches.length; index++) {
            if (allTiles[tileIds[i]].matches[index].length === 0) matches++; 
        }
        if (matches == 2) {
            while (allTiles[tileIds[i]].matches[0].length !== 0 || allTiles[tileIds[i]].matches[3].length !== 0) {
                allTiles[tileIds[i]] = rotateTile(allTiles[tileIds[i]], 1);
            }
            firstTile = allTiles[tileIds[i]];
            break;  
        }
    }

    var hasRight: boolean = true;
    var hasBelow: boolean = true;
    var completingRow: boolean = true;
    var row: number = 0;

    for (let i = 0; i < firstTile.map.length; i++) {
        map.push([firstTile.map[i]]);
    }

    var lastAddedRow: Tile = firstTile;
    var lastAddedColumn: Tile = firstTile;
    var newTile: Tile = allTiles[firstTile.matches[1][0]];
    // Add a tile on a new row, then add all other tiles to that row until no longer has a tile to add
    // Keep adding new rows until no more tiles to add at the bottom
    while (hasBelow || completingRow) {
        hasRight = true;
        while (hasRight) {
            // Rotate the tile to match the position if necessary
            // The new tile must have the current tile id on position 3 of the matches array (index 3 = left)
            newTile = rotateTile(newTile, mod(3 - getIndex(newTile.matches, lastAddedRow.id), 4));
            for (let i = 0; i < lastAddedRow.map.length; i++) {
                if (lastAddedRow.map[i][lastAddedRow.map[i].length - 1] !== newTile.map[i][0]) {
                    newTile = allTiles[newTile.id] = flipTile(newTile, 'HORIZONTAL');
                    break;
                }
            }

            for (let i = 0; i < newTile.map.length; i++) {
                map[row + i].push(newTile.map[i]);
            }

            lastAddedRow = newTile;
            if (lastAddedRow.matches[1].length === 0) {
                hasRight = false;
            } else {
                newTile = allTiles[lastAddedRow.matches[1][0]];
            }
        }

        if (!hasBelow) break;

        newTile = allTiles[lastAddedColumn.matches[2][0]];
        
        // Rotate the tile to match the position if necessary
        // The new tile must have the current tile id on position 0 of the matches array (index 0 = top)
        newTile = rotateTile(newTile, mod(0 - getIndex(newTile.matches, lastAddedColumn.id), 4));
        for (let i = 0; i < allTiles[lastAddedColumn.id].map.length; i++) {
            if (lastAddedColumn.map[lastAddedColumn.map.length - 1][i] !== newTile.map[0][i]) {
                newTile = allTiles[newTile.id] = flipTile(newTile, 'VERTICAL');
            }
        }

        for (let i = 0; i < newTile.map.length; i++) {
            map.push([newTile.map[i]]);
        }

        lastAddedColumn = newTile;
        if (lastAddedColumn.matches[2].length === 0) hasBelow = false;

        newTile = allTiles[lastAddedColumn.matches[1][0]];
        lastAddedRow = lastAddedColumn;
        row += lastAddedColumn.map.length;
    }

    // Create the final map combining all tiles, removing the borders of each one
    var finalMap: string[][] = [];
    const squareSize: number = allTiles[tileIds[0]].map.length;
    var index: number = 0;
    for (let i = 0; i < map.length; i++) {
        if (i % squareSize !== 0 && i % squareSize !== (squareSize - 1)) {
            finalMap.push([]);

            for (let j = 0; j < map[i].length; j++) {
                for (let k = 0; k < map[i][j].length; k++) {
                    if (k % squareSize !== 0 && k % squareSize !== (squareSize - 1)) {
                        finalMap[index].push(map[i][j][k]);
                    }
                }
            }
            index++;
        } 
    }
    return finalMap;
}

// Mod function that works for negative numbers (% doesn't work for negative numbers)
function mod(number: number, divisor: number) {
    return ((number % divisor) + divisor) % divisor;
}

function getIndex(matches:string[][], id: string) {
    for (let i = 0; i < matches.length; i++) {
        for (let j = 0; j < matches[i].length; j++) {
            if (matches[i][j] == id) return i;
        }
    }
    return -1;
}

function rotateTile(tile:Tile, count: number) {
    if (count === 0 ) return tile;

    // Rotate map and matches
    tile.map = rotateMap(tile.map, count);
    for (let i = 0; i < count; i++) {
        tile.matches.unshift(tile.matches.pop());
    }

    return tile;
}

function flipTile(tile:Tile, direction: string) {
    // Flip tile and matches
    tile.map = flipMap(tile.map, direction);

    var aux: string[];
    if (direction == 'VERTICAL') {
        aux = tile.matches[1];
        tile.matches[1] = tile.matches[3];
        tile.matches[3] = aux;
    } else {
        aux = tile.matches[0];
        tile.matches[0] = tile.matches[2];
        tile.matches[2] = aux;
    }
    
    return tile;
}

// Rotate map clockwise
function rotateMap(map:string[][], count: number) {
    if (count === 0 ) return map;
    let rotate: string[][] = [];

    for (let i = 0; i < count; i++) {
        rotate = [];
        for (let j = 0; j < map.length; j++) {
            rotate.push([]);
            for (let k = 0; k < map[j].length; k++) {
                rotate[j].push(map[map.length - k - 1][j])
            }
        }
        map = rotate;
    }

    return map;
}

// Can flip VERTICAL or HORIZONTAL
function flipMap(map:string[][], direction: string) {
    if (direction == 'VERTICAL') {
        for (let i = 0; i < map.length; i++) {
            map[i].reverse();
        }
    } else {
        map.reverse();
    }
    return map;
}

function countMonsters(map: string[][]) {
    var monstersCount: number = 0;
    var monsterMask: string[][] = [
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'M', '.'], 
        ['M', '.', '.', '.', '.', 'M', 'M', '.', '.', '.', '.', 'M', 'M', '.', '.', '.', '.', 'M', 'M', 'M'], 
        ['.', 'M', '.', '.', 'M', '.', '.', 'M', '.', '.', 'M', '.', '.', 'M', '.', '.', 'M', '.', '.', '.']];

    const maskHeight: number = monsterMask.length;
    const maskWidth: number = monsterMask[0].length;

    // For each 8 possible positions of the map, check until you find at least one monster on one of them
    for (let i = 0; i < 8; i++) {
        if (i === 4) map = flipMap(map, 'VERTICAL');
        map = rotateMap(map, i % 4);
        
        for (let j = 0; j <= map.length - maskHeight; j++) {
            for (let k = 0; k <= map[j].length - maskWidth; k++) {
                if (matchMask(map, monsterMask, j, k) ) monstersCount++;
            }
            
        }
        if (monstersCount > 0) break;
    }

    console.log('Monsters: ', monstersCount);
    return monstersCount;
}

// If the map contain # on all positions where the mask has M, it was a match
function matchMask(map: string[][], mask: string[][], row: number, column: number) {
    for (let i = 0; i < mask.length; i++) {
        for (let j = 0; j < mask[i].length; j++) {
            if (mask[i][j] === 'M' && map[row + i][column + j] !== '#') return false;
        }
    }
    return true;
}

// Count # that were not a monster
function countRoughWater(map: string[][], monstersCount: number) {
    var count: number = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') count++;  
        } 
    }
    return count - monstersCount * 15;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
