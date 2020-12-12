import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            
        })
        .on('close', function (err) {
            resolve();
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
