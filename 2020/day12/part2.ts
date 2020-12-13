import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        var direction: string = 'E';
        var directionsRight: string[] = ['E', 'S', 'W', 'N'];
        var directionsLeft: string[] = ['E', 'N', 'W', 'S'];
        var positions: object = {'E': 0, 'W': 0, 'N': 0, 'S': 0};
        var waypoint: object = {'E': 10, 'W': 0, 'N': 1, 'S': 0};
        var inst, aux: string;
        var qtd: number;
        var d: string[];
        var pos: object;
        

        reader.on("line", (l: string) => {
            inst = l.charAt(0);
            qtd = Number(l.substring(1));

            if (['N', 'S', 'E', 'W'].indexOf(inst) >= 0) {
                waypoint[inst] += qtd;
            } else if (inst === 'F') {
                for (let i = 0; i < directionsRight.length; i++) {
                    positions[directionsRight[i]] += qtd * waypoint[directionsRight[i]];
                }
            } else if (inst === 'R') {
                pos = {'E': waypoint['E'], 'W': waypoint['W'], 'N': waypoint['N'], 'S': waypoint['S']};
                d = [...directionsRight];
                for (let i = 0; i < (qtd / 90); i++) {
                    aux = directionsRight.shift();
                    directionsRight.push(aux);
                }
                direction = directionsRight[0];

                while (directionsLeft[0] != direction) {
                    aux = directionsLeft.shift();
                    directionsLeft.push(aux)
                }
                updatePosition(waypoint, pos, directionsRight, d);
            } else if (inst === 'L') {
                pos = {'E': waypoint['E'], 'W': waypoint['W'], 'N': waypoint['N'], 'S': waypoint['S']};
                d = [...directionsLeft];
                for (let i = 0; i < (qtd / 90); i++) {
                    aux = directionsLeft.shift();
                    directionsLeft.push(aux);
                }
                direction = directionsLeft[0];

                while (directionsRight[0] != direction) {
                    aux = directionsRight.shift();
                    directionsRight.push(aux)
                }
                updatePosition(waypoint, pos, directionsLeft, d);
            }
        })
        .on('close', function (err) {
            resolve(Math.abs(positions['E'] - positions['W']) + Math.abs(positions['N'] - positions['S']));
        })
    }); 
};

function updatePosition(pos: object, prevPos: object, directions: string[], prevDirections: string[]) {
    for (let i = 0; i < directions.length; i++) {
        pos[directions[i]] = prevPos[prevDirections[i]];
    }
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();