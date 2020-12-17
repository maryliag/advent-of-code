import * as fs from 'fs';
import * as rd from 'readline'

class Rules {
    field: string;
    firstRange: object;
    secondRanga: object;

    constructor (info: string) {
        this.field = info.split(':')[0];

        var ranges = info.split(': ')[1].split(' or ');
        this.firstRange = {min: ranges[0].split('-')[0], max: ranges[0].split('-')[1]};
        this.secondRanga = {min: ranges[1].split('-')[0], max: ranges[1].split('-')[1]};
    }

    // The field must respect both ranges to be valid
    isFieldValid(number: number) {
        if (number >= this.firstRange['min'] && number <= this.firstRange['max']) return true;
        if (number >= this.secondRanga['min'] && number <= this.secondRanga['max']) return true;
        return false;
    }
}

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var rules: Rules[] = [];
    var myTicket: string[];
    var info: number = 0;
    var errorRate: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.length !== 0) {
                if (l.includes('your')) info++;
                if (l.includes('nearby')) info++;

                if (info === 0) { // File starts with a list of rules
                    rules.push(new Rules(l));
                } else if (info === 1) { // Followed by your ticket
                    if (!l.includes('your')) myTicket = l.split(',');  
                } else if (info === 2) { // And then a list of nearby tickets
                    // Adding up all the numbers that are not valid
                    if (!l.includes('nearby')) errorRate = isTicketValid(l.split(','), rules, errorRate);
                }
            }
        })
        .on('close', function (err) {
            resolve(errorRate);
        })
    }); 
};

// Check if each number on the ticket has at least one rule that fits
// If the number doesn't follow any rules, is not a valid ticket
function isTicketValid(numbers:string[], rules: Rules[], errorRate: number) {
    var numberValid: boolean = false;
    for (let i = 0; i < numbers.length; i++) {
        numberValid = false;
        for (let j = 0; j < rules.length; j++) {
            
            if (rules[j].isFieldValid(Number(numbers[i]))) {
                numberValid = true;
                break;
            }
        }
        if (!numberValid) errorRate += Number(numbers[i]);
    }
    
    return errorRate;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
