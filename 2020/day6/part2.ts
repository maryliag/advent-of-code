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
            if (l.length === 0) {
                total += letters.length;
                letters = [];
                first = true;
            } else {
                lettersAux = [];
                for (let i = 0; i < l.length; i++) {
                    lettersAux.push(l.charAt(i));
                }

                if (first) {
                    letters = lettersAux;
                    first = false;
                } else {
                    letters = letters.filter(element => lettersAux.includes(element));
                }
            }

        })
        .on('close', function (err) {
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
