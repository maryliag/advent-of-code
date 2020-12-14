import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var instructions: object[] = [];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            instructions.push({op: l.split(' ')[0], val: Number(l.split(' ')[1]), ran: false});
        })
        .on('close', function (err) {
            var acc: number = 0;
            var index: number = 0;

            // Runs until it finds a instruction that has been run previously
            while (!instructions[index]['ran']) {
                instructions[index]['ran'] = true; // Update the value of the isntruction to show it has been run
                if (instructions[index]['op'] === 'acc') {
                    acc += instructions[index]['val'];
                    index++;
                } else if (instructions[index]['op'] === 'nop') {
                    index++;
                } else if (instructions[index]['op'] === 'jmp') {
                    index += instructions[index]['val'];
                } 
            }

            resolve(acc);
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
