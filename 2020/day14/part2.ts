import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var mem: number[] = [];
    var mask: string;
    var sum: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.split(' = ')[0] === 'mask') { // If value is a mask, updates its value, otherwise insert new value to all possible memory positions
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
    var allPositions: number[] = possiblePositions(pos, mask);
    
    for (let i = 0; i < allPositions.length; i++) {
        // Since we're trying to find the sum of all values, save this to a variable
        // Whenever the memory has a previous value, remove from the sum and add the new one, otherwise just adds the new value
        if (mem[allPositions[i]]) {
            sum -= mem[allPositions[i]];
        }
        mem[allPositions[i]] = Number(line.split(' = ')[1]);
        sum += mem[allPositions[i]];
    }
    return sum;
}

function possiblePositions(pos:number, mask: string) {
    var positions: number[] = [];
    var maskedInfo: object = maskedNumber(pos, mask);
    var replace: string;
    var newPos: string;
    var index: number;

    // Replace will be a string in binary with the same lenght of Xs on the masked value
    // The loop will replace each X by the value on the replace parameter in order and keep all other elements as is
    for (let i = 0; i < maskedInfo['possibilities']; i++) {
        newPos = '';
        index = 0;
        replace = (i >>> 0).toString(2); // Convert to Binary
        while (replace.length < maskedInfo['xCount']) {
            replace = '0' + replace;
        }
        
        for (let j = 0; j < maskedInfo['value'].length; j++) {
            if (maskedInfo['value'].charAt(j) === 'X') {
                newPos += replace.charAt(index);
                index++;
            } else {
                newPos += maskedInfo['value'].charAt(j);
            }
        }
        positions.push(parseInt(newPos, 2)); // Convert the position to decimal
    }

    return positions;
}

function maskedNumber(value:number, mask: string) {
    var binary: string = (value >>> 0).toString(2); // Convert to Binary
    var maskedInfo: object = {value: '', xCount: 0};
    var possibilities: string = ''
    while (binary.length < mask.length) {
        binary = '0' + binary;
    }
    // If mask is 0 use original binary value, otherwise use the value on the mask
    for (let i = 0; i < binary.length; i++) {
        if (mask.charAt(i) === '0') {
            maskedInfo['value'] += binary.charAt(i);
        } else {
            maskedInfo['value'] += mask.charAt(i);
            // If value is X save the total count and add 1 to the possibilities count (in binary)
            // e.g. if found 2X there are
            if (mask.charAt(i) === 'X') {
                possibilities += '1';
                maskedInfo['xCount']++;
            }
        }
    }
    // Convert the possibilities count to decimal and add one
    // e.g. if found 2 Xs, the possibilities will be `11` at this point, so the total number of possibilities to replace XX is 4 (00,01,10,11)
    maskedInfo['possibilities'] = parseInt(possibilities, 2) + 1;
    return maskedInfo;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
