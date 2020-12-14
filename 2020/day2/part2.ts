import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));

// Password Class with the 2 possible positions a letter must have (must be in exactly one of those positions)
class Pwd {
    pos1: number;
    pos2: number;
    letter: string;

    constructor(rule: string, letter: string) {
        this.pos1 = Number(rule.split('-')[0]) - 1;
        this.pos2 = Number(rule.split('-')[1]) - 1;
        this.letter = letter.charAt(0);
    }
}

// Check is the letter is in exactly one of those positions, otherwise is not valid
function isValid(pwd: string, rules: Pwd) {    
    if (pwd.charAt(rules.pos1) === rules.letter && pwd.charAt(rules.pos2) === rules.letter) return false;
    if (pwd.charAt(rules.pos1) !== rules.letter && pwd.charAt(rules.pos2) !== rules.letter) return false;
    return true;
}

function getResult() {
    var validPwd = 0;
    var pwdRules: Pwd;
    reader.on("line", (l: string) => {
        let info = l.split(' ');
        pwdRules = new Pwd(info[0], info[1]);
        
        // For each new pwd on the file, check if is valid and add to the counter
        if (isValid(info[2], pwdRules)) validPwd++;
    })
    .on('close', function (err) {
        console.log("Result: ", validPwd);
        return;
    })
};

getResult()