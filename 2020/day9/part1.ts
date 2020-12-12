import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var preambleSize: number = 25;
    var preamble: number[] = [];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (preamble.length < preambleSize) {
                preamble.push(Number(l));
            } else {
                if (isValid(Number(l), preamble)) {
                    preamble.push(Number(l));
                    preamble.shift();
                } else {
                    resolve(Number(l));
                }
            }
        })
    }); 
};

function isValid(number, preamble) {
    var index: number = 0;
    for (let i = 0; i < preamble.length; i++) {
        index = preamble.indexOf(number - preamble[i]);
        if ( index >= 0 && index != i) return true;
    }

    return false;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
