import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allIds: number[] = [];

    return new Promise<number>(resolve => {
        var r: number = 0;
        var c: number = 0;
        reader.on("line", (l: string) => {
            r = getValue(l.substring(0, 7), 0, 127);
            c = getValue(l.substring(7), 0, 7);
            allIds.push((r * 8 + c));
        })
        .on('close', function (err) {
            allIds.sort();
            
            for (let i = 0; i < (allIds.length - 1); i++) {
                // If the next element is jumping 2 numbers, it found the missing id
                if (allIds[i + 1] === allIds[i] + 2) resolve(allIds[i] + 1);
            }
        })
    }); 
};

// Get the value from the Binary Space Partitioning. 
// If F or L get the lower half
// If B or R get the upper half
function getValue(bsp: string, min: number, max: number) {
    var mid: number = 0;
    for (let i = 0; i < bsp.length; i++) {
        if (bsp.charAt(i) == 'F' || bsp.charAt(i) == 'L') {
            mid = Math.ceil((max - min)/2);
            max = max - mid;
        } else {
            mid = Math.ceil((max - min)/2);
            min = min + mid;
        }
    }
    
    return max;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
