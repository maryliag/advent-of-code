import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));
var values:number[] = [];

class Pwd {
    min: number;
    max: number;
    letter: string;

    constructor(rule: string, letter: string) {
        this.min = Number(rule.split('-')[0]);
        this.max = Number(rule.split('-')[1]);
        this.letter = letter.charAt(0);
    }
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function isValid(pwd: string, rules: Pwd) {
    var occurences = countOccurrences(pwd.split(''), rules.letter);
    if (occurences >= rules.min && occurences <= rules.max) return true;
    return false;
}

function getResult() {
    var validPwd = 0;
    var pwdRules;
    reader.on("line", (l: string) => {
        let info = l.split(' ');
        pwdRules = new Pwd(info[0], info[1]);
        
        if (isValid(info[2], pwdRules)) validPwd++;
    })
    .on('close', function (err) {
        console.log("Result: ", validPwd);
        return;
    })
};

getResult()