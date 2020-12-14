import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var letters: string[] = [];
    var lettersAux: string[] = [];
    var total: number = 0;
    var first: boolean = true;

    return new Promise<number>(resolve => {
        letters = [];
        reader.on("line", (l: string) => {
            // If empty line, that grouped ended, so add the count of different questions to the total
            if (l.length === 0) {
                total += letters.length;
                letters = [];
                first = true;
            } else {
                lettersAux = l.split('');

                // If is the first person from the group add all the questions
                // For all others, filter the letters list to result on just the intersection between the letters of the two people
                if (first) {
                    letters = lettersAux;
                    first = false;
                } else {
                    letters = letters.filter(element => lettersAux.includes(element));
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
