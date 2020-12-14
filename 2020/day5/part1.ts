import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var maxId: number = 0;

    return new Promise<number>(resolve => {
        var r: number = 0;
        var c: number = 0;
        reader.on("line", (l: string) => {
            r = getValue(l.substring(0, 7), 0, 127);
            c = getValue(l.substring(7), 0, 7);
            // Looking for the max value of row * 8 + column
            if ((r * 8 + c) > maxId) maxId = r * 8 + c;
        })
        .on('close', function (err) {
            resolve(maxId);
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
