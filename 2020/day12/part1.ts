import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        var directionInfo: object = {direction: 'E', index: 0};
        // List of directions in order if rotate clockwise (R)
        var directions: string[] = ['E', 'S', 'W', 'N'];
        // Amount that the ship moved into each direction
        var positions: object = {'E': 0, 'W': 0, 'N': 0, 'S': 0};
        var inst: string;
        var qtd: number;

        reader.on("line", (l: string) => {
            inst = l.charAt(0);
            qtd = Number(l.substring(1));

            if (['N', 'S', 'E', 'W'].indexOf(inst) >= 0) { // Add the instruction amount to the ship's position
                positions[inst] += qtd;
            } else if (inst === 'F') { // Add the instruction amount to the current direction of the ship's position
                positions[directionInfo['direction']] += qtd;
            } else if (inst === 'R') { // Update the direction info, using the directions array on that order
                directionInfo['direction'] = directions[mod(directionInfo['index'] + qtd/90, 4)];
                directionInfo['index'] = mod(directionInfo['index'] + qtd/90, 4);
            } else if (inst === 'L') { // Update the direction info, using the directions array on the opposite order
                directionInfo['direction'] = directions[mod(directionInfo['index'] - qtd/90, 4)];
                directionInfo['index'] = mod(directionInfo['index'] - qtd/90, 4);
            }
        })
        .on('close', function (err) {
            // Return the Manhattan distance (sum of the absolute values of its east/west position and its north/south position)
            resolve(Math.abs(positions['E'] - positions['W']) + Math.abs(positions['N'] - positions['S']));
        })
    }); 
};

// Mod function that works for negative numbers (% doesn't work for negative numbers)
function mod(number: number, divisor: number) {
    return ((number % divisor) + divisor) % divisor;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
