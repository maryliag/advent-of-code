import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var mem: number[] = [];
    var mask: string;
    var sum: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.split(' = ')[0] === 'mask') { // If value is a mask, updates its value, otherwise insert new masked value to memory
                mask = l.split(' = ')[1];
            } else {
                sum = insertToMemory(l, mem, mask, sum);
            }
        })
        .on('close', function (err) {
            resolve(sum);
        })
    }); 
};

function insertToMemory(line: string, mem: number[], mask: string, sum: number) {
    var pos: number = Number(line.split('] = ')[0].replace('mem[', ''));
    // Since we're trying to find the sum of all values, save this to a variable
    // Whenever the memory has a previous value, remove from the sum and add the new one, otherwise just adds the new value
    if (mem[pos]) {
        sum -= mem[pos];
    }
    mem[pos] = maskedNumber(Number(line.split(' = ')[1]), mask);
    sum += mem[pos];
    return sum;
}

function maskedNumber(value:number, mask: string) {
    var binary: string = (value >>> 0).toString(2); // Convert to Binary
    var maskedValue: string = '';
    while (binary.length < mask.length) {
        binary = '0' + binary;
    }
    // If mask is X, use original binary value, otherwise use the value on the mask
    for (let i = 0; i < binary.length; i++) {
        if (mask.charAt(i) != 'X') {
            maskedValue += mask.charAt(i);
        } else {
            maskedValue += binary.charAt(i);
        }
    }

    return parseInt(maskedValue, 2); // Convert back to decimal
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();

