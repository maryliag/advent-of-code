import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var numbers: object = {};
    var index: number = 1;
    var latest: number;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            var starting = l.split(',');
            for (let i = 0; i < starting.length; i++) {
                numbers[starting[i]] = {turn1: index, turn2: index};
                latest = Number(starting[i]);
                index++;
            }
        })
        .on('close', function (err) {
            // Get the next value until it reaches the 30000000th round
            while (index < 30000001) {
                latest = getCurrentNumber(latest, index, numbers);
                index++;
            }
            resolve(latest);
        })
    }); 
};

function getCurrentNumber(latest:number, index: number, numbers: object) {
    // If the number was never spoken before the values of turn1 and turn2 will be the same, resulting on n = 0 
    var n: number = numbers[latest]['turn2'] - numbers[latest]['turn1'];
    // If the new number was spoken before, update the values from the turns
    // Otherwise add the new number with the current index on both turn keys
    if (numbers[n]) {
        numbers[n] = {turn1: numbers[n]['turn2'], turn2: index};  
    } else {
        numbers[n] = {turn1: index, turn2: index};
    }
    return n;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
