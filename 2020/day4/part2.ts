import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));

    return new Promise<number>(resolve => {
        var countValid = 0;
        var doc = new Document();
        var info: string[];
        reader.on("line", (l: string) => {
            // If line is empty, a document just ended, so create the new Document and check if is valid
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
            // After file finishes there is the last Document to check
            if (doc.isValid()) countValid++;
            resolve(countValid)
        })
    }); 
};

async function resolveChallenge() {
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
        var v = this.validBirthYear() && this.validIssueYear() && this.validExpirationYear() && this.validHeight() && this.validHair() && 
        this.validEye() && this.validPassportId();
        return v;  
    };

    validBirthYear() {
        if (this.byr == undefined) return false;
        if (Number(this.byr) >= 1920 && Number(this.byr) <= 2002) return true;
        return false;
    }
    validIssueYear() {
        if (this.iyr == undefined) return false;
        if (Number(this.iyr) >= 2010 && Number(this.iyr) <= 2020) return true;
        return false;
    }
    validExpirationYear() {
        if (this.eyr == undefined) return false;
        if (Number(this.eyr) >= 2020 && Number(this.eyr) <= 2030) return true;
        return false;
    }
    validHeight() {
        if (this.hgt == undefined) return false;
        if (this.hgt.split('cm').length == 2) {
            if(Number(this.hgt.split('cm')[0]) >= 150 && Number(this.hgt.split('cm')[0]) <= 193) return true;
            return false;
        } else {
            if(Number(this.hgt.split('in')[0]) >= 59 && Number(this.hgt.split('in')[0]) <= 76) return true;
            return false;
        }
    }
    validHair() {
        if (this.hcl == undefined) return false;
        if (this.hcl.length !== 7) return false;
        var re = new RegExp("#([0-9]|[a-f]){6}");
        return re.test(this.hcl);
    }
    validEye() {
        if (this.ecl == undefined) return false;
        if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(this.ecl) >= 0) return true;
        return false;
    }
    validPassportId() {
        if (this.pid == undefined) return false;
        if (this.pid.length !== 9) return false;
        var re = new RegExp("[0-9]{9}");
        return re.test(this.pid);
    }
}

resolveChallenge();