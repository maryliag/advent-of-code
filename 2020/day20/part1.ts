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
        this.borders = [this.map[0], [], this.map[this.map.length - 1], []];
        for (let i = 0; i < this.map.length; i++) {
            this.borders[1].push(this.map[i][this.map[i].length - 1]);
            this.borders[3].push(this.map[i][0]);
        }
    }
}

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allTiles: Tile[] = [];
    let tile: Tile;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.includes('Tile')) {
                tile = new Tile(l.split(' ')[1].split(':')[0]);
            } else if (l.length === 0) {
                tile.initializeBorders();
                allTiles.push(tile);
            } else {
                tile.map.push(l.split(''));
            }
        })
        .on('close', function (err) {
            tile.initializeBorders();
            allTiles.push(tile);

            let edges: number[] = findEdges(allTiles);
            let result: number = 1;
            console.log('Edges: ', edges);
            
            // Return the multiplication of the edges
            for (let i = 0; i < edges.length; i++) {
                result *= edges[i];
            } 
            
            resolve(result);
        })
    }); 
};

function findEdges(allTiles:Tile[]) {
    var edges: number[] = [];
    var foundAllEdges: boolean = false;

    for (let i = 0; i < allTiles.length && !foundAllEdges; i++) {
        const tile = allTiles[i];
        for (let j = i + 1; j < allTiles.length; j++) {
            const possibleTile = allTiles[j];
            
            // For each tile, look into all others that weren't checked yet if any of the borders (or its reverse) match
            // If they do, update both the current tile and the possible match
            for (let k = 0; k < tile.borders.length; k++) {
                for (let l = 0; l < possibleTile.borders.length; l++) {
                    if (tile.borders[k].toString() == possibleTile.borders[l].toString() ||
                    tile.borders[k].toString() == possibleTile.borders[l].reverse().toString()) {
                        tile.matches[k].push(possibleTile.id);
                        possibleTile.matches[l].push(tile.id);
                    }

                }
            }
        }  

        let matches: number = 0;
        for (let index = 0; index < tile.matches.length; index++) {
            if (tile.matches[index].length === 0) matches++; 
        }
        // If only 2 borders had matches, it means this tile is an edge
        if (matches == 2) {
            edges.push(Number(tile.id));
        }
        if (edges.length === 4) foundAllEdges = true;
    }

    return edges;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
