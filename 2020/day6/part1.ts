import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var letters: string[] = [];
    var total: number = 0;

    return new Promise<number>(resolve => {
        letters = [];
        reader.on("line", (l: string) => {
            // If empty line, that grouped ended, so add the count of different questions to the total
            if (l.length === 0) {
                total += letters.length;
                letters = [];
            } else {
                for (let i = 0; i < l.length; i++) {
                    // Add question to a list if not yet there
                    if (letters.indexOf(l.charAt(i)) < 0) {
                        letters.push(l.charAt(i));
                    }
                }
            }
        })
        .on('close', function (err) {
            // Add the count of letters of the last group to the total
            total += letters.length;
            resolve(total);
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
