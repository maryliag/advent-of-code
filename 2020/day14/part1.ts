import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var mem: number[] = [];
    var mask: string;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.split(' = ')[0] === 'mask') { // If value is a mask, updates its value, otherwise insert new masked value to memory
                mask = l.split(' = ')[1];
            } else {
                insertToMemory(l, mem, mask);
            }
        })
        .on('close', function (err) {
            var sum:number = 0;
            for (let i = 0; i < mem.length; i++) {
                if (mem[i]) {
                    sum += mem[i];
                }
            }
            resolve(sum);
        })
    }); 
};

function insertToMemory(line: string, mem: number[], mask: string) {
    var pos: number = Number(line.split('] = ')[0].replace('mem[', ''));
    mem[pos] = maskedNumber(Number(line.split(' = ')[1]), mask);
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

