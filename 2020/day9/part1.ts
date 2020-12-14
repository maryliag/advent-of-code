import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var preambleSize: number = 25;
    var preamble: number[] = [];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (preamble.length < preambleSize) { // Add number until reached the preamble size
                preamble.push(Number(l));
            } else {
                if (isValid(Number(l), preamble)) { // Add a number only if is valid, otherwise return that number
                    preamble.push(Number(l));
                    preamble.shift();
                } else {
                    resolve(Number(l));
                }
            }
        })
    }); 
};

// A number is valid if is possible to find two numbers on the preamble array that can be added to generate it
function isValid(number: number, preamble: number[]) {
    var index: number = 0;
    for (let i = 0; i < preamble.length; i++) { // For each number check if its complementary it's on the array
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
