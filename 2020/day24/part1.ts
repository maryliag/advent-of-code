import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var tiles: object = {};

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            l = generateInstructions(l).substr(1);
            tiles = flipTile(l, tiles);
        })
        .on('close', function (err) {
            let black: number = 0;
            let keys: string[] = Object.keys(tiles);

            for (let i = 0; i < keys.length; i++) {
                if (tiles[keys[i]] === 'black') black++;
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

function flipTile(instructions: string, tiles: object) {
    var inst: string[] = instructions.split(',');
    var x: number = 0;
    var y: number = 0;
    for (let i = 0; i < inst.length; i++) {
        x += Number(inst[i].split('&')[0].substr(1));
        y += Number(inst[i].split('&')[1].substr(1));
        
    }

    // If a tile was never touched, set to black, otherwise flip the current value
    let newTile: string = x.toString() + ',' + y.toString();
    if (tiles[newTile]) {
        if (tiles[newTile] === 'black') {
            tiles[newTile] = 'white';
        } else {
            tiles[newTile] = 'black';
        }
    } else {
        tiles[newTile] = 'black';
    }
    return tiles;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
