import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var cardPublic: number;
    var doorPublic: number;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (cardPublic) {
                doorPublic = Number(l);
            } else {
                cardPublic = Number(l);
            }
        })
        .on('close', function (err) {
            resolve(calculateEncryptionKey(7, cardPublic, doorPublic));
        })
    }); 
};

function calculateEncryptionKey(subject: number, card: number, door: number) {
    var loopSize: number = 0;
    var transformed: number = subject;
    var encryption: object = {card: card, door: door};

    // Runs until find the smalles loop between the two public keys
    while (transformed !== card && transformed !== door) {
        transformed *= subject;
        transformed = (transformed % 20201227);

        // Use the loop to calculate the encryption with both punlic keys and return the correct one
        encryption['card'] *= card;
        encryption['card'] = (encryption['card'] % 20201227);

        encryption['door'] *= door;
        encryption['door'] = (encryption['door'] % 20201227);

        loopSize++;
    }

    if (transformed === card) {
        return encryption['door'];
    }

    return encryption['card'];
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
