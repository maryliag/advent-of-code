import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var invalidNumber: number = 556543474;
    var numbers: number[] = [];
    var weakness: number;


    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            numbers.push(Number(l));
            weakness = findWeakness(invalidNumber, numbers);

            if (weakness > 0) resolve(weakness);
        })
    }); 
};

function findWeakness(invalidNumber, numbers) {
    var total: number;
    var index: number;
    var adding: number[];

    for (let i = 0; i < numbers.length; i++) {
        total = 0;
        adding = [];
        index = i;
        
        while (total < invalidNumber && index < numbers.length) {
            adding.push(numbers[index]);
            total += numbers[index];
            index++;
        }
        if (total == invalidNumber) {
            adding.sort();
            return adding[0] + adding[adding.length - 1];
        }
    }
    return 0;

}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
