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

    // Runs until find the smalles loop between the two public keys
    while (transformed !== card && transformed !== door) {
        transformed *= subject;
        transformed = (transformed % 20201227);

        loopSize++;
    }
    
    // Calculate the encryption with the public key you don't know the loop size, using the loop size from the one you know
    var encryption: number = transformed === card? door : card;
    subject = transformed === card? door : card;
    for (let i = 0; i < loopSize; i++) {
        encryption *= subject;
        encryption = (encryption % 20201227);
    }

    return encryption;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
