import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        var countValid = 0;
        var doc = new Document();
        var info: string[];
        reader.on("line", (l: string) => {
            if (l.length == 0) {
                if (doc.isValid()) countValid++;
                doc = new Document();
            } else {
                info = l.split(' ');
                for (let i = 0; i < info.length; i++) {
                    doc[info[i].split(':')[0]] = info[i].split(':')[1];
                }
            }
        })
        .on('close', function (err) {
            if (doc.isValid()) countValid++;
            resolve(countValid)
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

class Document {
    byr: string;
    iyr: string;
    eyr: string;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
    cid: string;

    isValid() {
        if (this.byr === undefined || this.iyr === undefined || this.eyr === undefined || this.hgt === undefined || this.hcl === undefined || 
            this.ecl == undefined || this.pid === undefined) return false;
        return true;
    };
}

solveChallenge();


