import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var floor: object = {edges: {xmin : 0, xmax: 0, ymin: 0, ymax: 0}, tiles: {}};

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            l = generateInstructions(l).substr(1);
            floor = flipTile(l, floor);
        })
        .on('close', function (err) {
            let black: number;
            let keys: string[];

            for (let i = 1; i <= 100; i++) {
                floor = applyRules(floor);
                black = 0;
                keys = Object.keys(floor['tiles']);
                for (let j = 0; j< keys.length; j++) {
                    if (floor['tiles'][keys[j]] === 'black') black++;
                }
            }

            resolve(black);
        })
    }); 
};

// the x,y of an hexagon are considered to tip of it, so the one on east will be x+2 will the one on the ne/se will be x+1
function generateInstructions(info:string) {
    info = info.split('se').join(',x1&y-1');
    info = info.split('sw').join(',x-1&y-1');
    info = info.split('ne').join(',x1&y+1');
    info = info.split('nw').join(',x-1&y+1');
    info = info.split('e').join(',x2&y0');
    info = info.split('w').join(',x-2&y0');
    return info;
}

function flipTile(instructions: string, floor: object) {
    var inst: string[] = instructions.split(',');
    var x: number = 0;
    var y: number = 0;
    for (let i = 0; i < inst.length; i++) {
        x += Number(inst[i].split('&')[0].substr(1));
        y += Number(inst[i].split('&')[1].substr(1));
        
    }
    // If a tile was never touched, set to black, otherwise flip the current value
    let newTile: string = x.toString() + ',' + y.toString();
    if (floor['tiles'][newTile]) {
        if (floor['tiles'][newTile] === 'black') {
            floor['tiles'][newTile] = 'white';
        } else {
            floor['tiles'][newTile] = 'black';
        }
    } else {
        floor['tiles'][newTile] = 'black';
        if (x < floor['edges']['xmin']) floor['edges']['xmin'] = x;
        if (x > floor['edges']['xmax']) floor['edges']['xmax'] = x;
        if (y < floor['edges']['ymin']) floor['edges']['ymin'] = y;
        if (y > floor['edges']['ymax']) floor['edges']['ymax'] = y;
    }
    return floor;
}

function applyRules(floor:object) {
    // Create the tiles of the surrounding area and update the edges
    for (let x = floor['edges']['xmin'] - 1; x <= floor['edges']['xmax'] + 1; x++) {
        for (let y = floor['edges']['ymin'] - 1; y <= floor['edges']['ymax'] + 1; y++) {
            let newTile: string = x.toString() + ',' + y.toString();
            if (floor['tiles'][newTile] === undefined) floor['tiles'][newTile] = 'white';
        }
    }
    floor['edges']['xmin']--;
    floor['edges']['xmax']++;
    floor['edges']['ymin']--;
    floor['edges']['ymax']++;

    // Set to pending state
    for (let x = floor['edges']['xmin']; x <= floor['edges']['xmax']; x++) {
        for (let y = floor['edges']['ymin']; y <= floor['edges']['ymax']; y++) {
            let tile: string = x.toString() + ',' + y.toString();
            let adjacents: number = countAdjacentBlackTiles(floor, tile);
            if (floor['tiles'][tile] === 'black' && ( adjacents === 0 || adjacents > 2)) floor['tiles'][tile] = 'W';
            if (floor['tiles'][tile] === 'white' && adjacents === 2) floor['tiles'][tile] = 'B';
        }
    }

    // Set to final value
    for (let x = floor['edges']['xmin']; x <= floor['edges']['xmax']; x++) {
        for (let y = floor['edges']['ymin']; y <= floor['edges']['ymax']; y++) {
            let tile: string = x.toString() + ',' + y.toString();
            if (floor['tiles'][tile] === 'W') floor['tiles'][tile] = 'white';
            if (floor['tiles'][tile] === 'B') floor['tiles'][tile] = 'black';
        }
    }

    return floor;
}

function countAdjacentBlackTiles(floor:object, tile: string) {
    var count: number = 0;
    var x: number = Number(tile.split(',')[0]);
    var y: number = Number(tile.split(',')[1]);
    var checks: string[] = [
        (x-2).toString() + ',' + y.toString(),
        (x-1).toString() + ',' + (y-1).toString(),
        (x+1).toString() + ',' + (y-1).toString(),
        (x+2).toString() + ',' + y.toString(),
        (x+1).toString() + ',' + (y+1).toString(),
        (x-1).toString() + ',' + (y+1).toString(),
    ];

    // Check if tile is black or is the pending state to turn white (meaning is still currently black)
    for (let i = 0; i < checks.length; i++) {
        if (floor['tiles'][checks[i]] === 'black' || floor['tiles'][checks[i]] === 'W') count++;
    }

    return count;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
