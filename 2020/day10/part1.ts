import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var adapters: number[] = [];
    var joltDiff: object = {1: 0, 2: 0, 3: 0};

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            adapters.push(Number(l));
        })
        .on('close', function (err) {
            adapters.sort(function(a, b){return a-b})
            adapters.push(adapters[adapters.length - 1] + 3);
            var prev: number = 0;

            for (let i = 0; i < adapters.length; i++) {
                joltDiff[adapters[i] - prev]++; 
                prev = adapters[i];
            }
            
            resolve(joltDiff['1'] * joltDiff['3']);
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
