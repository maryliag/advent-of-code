import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var invalidNumber: number = 556543474;
    var numbers: number[] = [];
    var weakness: number;


    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            // Add numbers until it finds the weakness
            numbers.push(Number(l));
            weakness = findWeakness(invalidNumber, numbers);
            if (weakness > 0) resolve(weakness);
        })
    }); 
};

function findWeakness(invalidNumber: number, numbers: number[]) {
    var total: number;
    var index: number;
    var adding: number[];

    // For each element, keep adding the following ones until find the exact or higher value compared to the number we're checking 
    // or there are no more numbers to add
    for (let i = 0; i < numbers.length; i++) {
        total = 0;
        adding = [];
        index = i;
        
        while (total < invalidNumber && index < numbers.length) {
            adding.push(numbers[index]);
            total += numbers[index];
            index++;
        }
        if (total == invalidNumber) { // If the sum was the exact value return the sum of the smallest and largest number
            adding.sort();
            return adding[0] + adding[adding.length - 1];
        }
        // If the sum was greater or smaller then the value, go to the next element of the array
    }
    return 0;

}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
