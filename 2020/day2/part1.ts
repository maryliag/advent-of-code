import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));

// Password Class with the min and max value of occurrences the letter must have
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

// Calculate number of occurrences of a letter on a given array
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

// Check if the pwd is valid given the rules (min and max occurrences of a letter)
function isValid(pwd: string, rules: Pwd) {
    var occurences = countOccurrences(pwd.split(''), rules.letter);
    if (occurences >= rules.min && occurences <= rules.max) return true;
    return false;
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