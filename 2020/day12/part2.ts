import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        // List of directions in order if rotate clockwise (R)
        var directions: string[] = ['E', 'S', 'W', 'N'];
        // Amount that the ship moved into each direction
        var positions: object = {'E': 0, 'W': 0, 'N': 0, 'S': 0};
        // Amount that the waypoint moved into each direction
        var waypoint: object = {'E': 10, 'W': 0, 'N': 1, 'S': 0};
        var inst: string;
        var qtd: number;

        reader.on("line", (l: string) => {
            inst = l.charAt(0);
            qtd = Number(l.substring(1));

            if (['N', 'S', 'E', 'W'].indexOf(inst) >= 0) { // Add the instruction amount to the waypoint' position
                waypoint[inst] += qtd;
            } else if (inst === 'F') { // Add the instruction amount * the waypoint position to each direction of the ship's position
                for (let i = 0; i <= 3; i++) {
                    positions[directions[i]] += qtd * waypoint[directions[i]];
                }
            } else if (inst === 'R') { // Rotate clockwise the values of the waypoint and ship's position
                updatePosition(waypoint, qtd/90, directions);
            } else if (inst === 'L') { // Rotate counterclockwise the values of the waypoint and ship's position
                updatePosition(waypoint, -qtd/90, directions);
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

// For each position value rotate to the new position value based on the amount it has rotate
// If rotations is positive is rotating clockwise, if negative is rotating counterclockwise
function updatePosition(pos: object, rotations: number, directions: string[]) {
    var currentPos: object = {'E': pos['E'], 'W': pos['W'], 'N': pos['N'], 'S': pos['S']};
    for (let i = 0; i <= 3; i++) {
        pos[directions[i]] = currentPos[directions[mod(i - rotations, 4)]];
    }
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();