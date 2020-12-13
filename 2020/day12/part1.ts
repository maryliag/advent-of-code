import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        var direction: string = 'E';
        var directionsRight: string[] = ['E', 'S', 'W', 'N'];
        var directionsLeft: string[] = ['E', 'N', 'W', 'S'];
        var positions: object = {'E': 0, 'W': 0, 'N': 0, 'S': 0};
        var inst: string;
        var qtd: number;
        var aux: string;

        reader.on("line", (l: string) => {
            inst = l.charAt(0);
            qtd = Number(l.substring(1));

            if (['N', 'S', 'E', 'W'].indexOf(inst) >= 0) {
                positions[inst] += qtd;
            } else if (inst === 'F') {
                positions[direction] += qtd;
            } else if (inst === 'R') {
                for (let i = 0; i < (qtd / 90); i++) {
                    aux = directionsRight.shift();
                    directionsRight.push(aux);
                }
                direction = directionsRight[0];

                while (directionsLeft[0] != direction) {
                    aux = directionsLeft.shift();
                    directionsLeft.push(aux)
                }
            } else if (inst === 'L') {
                for (let i = 0; i < (qtd / 90); i++) {
                    aux = directionsLeft.shift();
                    directionsLeft.push(aux);
                }
                direction = directionsLeft[0];

                while (directionsRight[0] != direction) {
                    aux = directionsRight.shift();
                    directionsRight.push(aux)
                }
            }
        })
        .on('close', function (err) {
            resolve(Math.abs(positions['E'] - positions['W']) + Math.abs(positions['N'] - positions['S']));
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
