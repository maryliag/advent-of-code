import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var adapters: number[] = [0];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            adapters.push(Number(l));
        })
        .on('close', function (err) {
            resolve(possibleCombinations(adapters));
        })
    }); 
};

function possibleCombinations(adapters: number[]) {
    var combinations: number = 0;
    var adaptersResults: object = {};
    adapters.sort(function(a, b){return a-b});
    adapters.push(adapters[adapters.length - 1] + 3);
    adaptersResults[adapters[adapters.length - 1]] = 1;

    for (let i = adapters.length - 2; i >= 0; i--) {
        combinations = 0;
        for (let j = 1; j < 4; j++) {
            if (adaptersResults[adapters[i] + j]) combinations += adaptersResults[adapters[i] + j];
        }
        adaptersResults[adapters[i]] = combinations;
    }
    return combinations;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
