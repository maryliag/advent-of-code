import * as fs from 'fs';
import * as rd from 'readline'

class Rules {
    field: string;
    firstRange: object;
    secondRange: object;

    constructor (info: string) {
        this.field = info.split(':')[0];

        var ranges = info.split(': ')[1].split(' or ');
        this.firstRange = {min: ranges[0].split('-')[0], max: ranges[0].split('-')[1]};
        this.secondRange = {min: ranges[1].split('-')[0], max: ranges[1].split('-')[1]};
    }

    // The field must respect both ranges to be valid
    isFieldValid(number: number) {
        if (number >= this.firstRange['min'] && number <= this.firstRange['max']) return true;
        if (number >= this.secondRange['min'] && number <= this.secondRange['max']) return true;
        return false;
    }
}

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var rules: Rules[] = [];
    var myTicket: string[];
    var validTickets: string[][] = [];
    var info: number = 0;

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
                    if (!l.includes('nearby')) {
                        // Add all valid tickets to a list, ignore the invalid ones
                        if (isTicketValid(l.split(','), rules)) {
                            validTickets.push(l.split(','));
                        }
                    }
                }
            }
        })
        .on('close', function (err) {
            validTickets.push(myTicket);
            var fields = calculateFields(validTickets, rules);
            var departures: number = 1;
            // Multiple the values on your ticket that have a field starting with 'departure'
            for (let i = 0; i < fields.length; i++) {
                if (fields[i][0].includes('departure')) {
                    departures *= Number(myTicket[i]);
                }
            }
            resolve(departures);
        })
    }); 
};

// Check if each number on the ticket has at least one rule that fits
// If the number doesn't follow any rules, is not a valid ticket
function isTicketValid(numbers:string[], rules: Rules[]) {
    var numberValid: boolean = false;
    for (let i = 0; i < numbers.length; i++) {
        numberValid = false;
        for (let j = 0; j < rules.length; j++) {
            
            if (rules[j].isFieldValid(Number(numbers[i]))) {
                numberValid = true;
                break;
            }
        }
        if (!numberValid) return false;
    }
    return true;
}

// Calculate which field must be on which position
function calculateFields(tickets: string[][], rules: Rules[]) {
    var fields: string[][] = [];
    var isValid: boolean;

    // Check for each i-number (same column) in all tickets follow the same rule
    for (let i = 0; i < tickets[0].length; i++) {
        fields.push([]);
        for (let j = 0; j < rules.length; j++) {
            isValid = true;
            for (let k = 0; k < tickets.length; k++) {
                if (!rules[j].isFieldValid(Number(tickets[k][i]))) {
                    isValid = false;
                    break;
                } 
            }
            // If a rule is valid for all numbers on the same position for all tickets, 
            // that field is added to a list os possible fields for that position
            if (isValid) {
                fields[i].push(rules[j]['field']);
            }
        }
    }
    // At this point is possible to have multiple solutions for the same position
    // Look for positions that have only one valid field and remove that fields from all other positions
    // Repeat this process until there is only one possible field for each position
    var hasRemoved: string[] = []; // add the field already removed to a list so we don't try to remove again
    while (!hasOnlyOneSolution(fields)) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].length === 1 && hasRemoved.indexOf(fields[i][0]) < 0) {
                fields = cleanUp(fields, fields[i][0]);
                hasRemoved.push(fields[i][0]);
            }
        }
    }
    
    return fields;
}

// Check if there is only one possible field for each position
function hasOnlyOneSolution(fields: string[][]) {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].length != 1) {
            return false;
        }
    }
    return true;
}

// Remove from all positions (except for the position to which the field is the only solution) the field passed on this function
function cleanUp(fields: string[][], field: string) {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].length != 1) {
            const index = fields[i].indexOf(field);
            if (index > -1) {
                fields[i].splice(index, 1);
            }
        } 
    }
    return fields;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
