import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var rules: object = {};
    var readingRules: boolean = true;
    var matches: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.length === 0) {
                readingRules = false;
            } 

            if (readingRules) {
                // Each rule is an object with the key its number and the value as an array of possible matches
                l = l.split('\"').join('');
                rules[l.split(':')[0]] = l.split(': ')[1].split(' | ');
            } else {
                if (matchRule(rules['0'], l, rules)) matches++;
            }
        })
        .on('close', function (err) {
            resolve(matches);
        })
    }); 
};

// Return if a message matches the rule passed
function matchRule(currentRules:string[], message: string, allRules: object) {
    if (message.length === 0 ) return false;
    var match: boolean = false;
    
    for (let i = 0; i < currentRules.length; i++) {
        const rules = currentRules[i].split(' ');
        // Apply each rule of that set until there are not rules to apply
        for (let j = 0; j < rules.length; j++) {
            let check: object = applyRule(rules[j], message, allRules);

            if (check['valid']) {
                message = check['message'];
                match = true;
            } else {
                match = false;
                break;
            }
        }
    }

    // If after all the rules were applying there were still character left to be analized, it's not a match (it must be the perfect size)
    if (message.length > 0) return false;
    return match;
}

// Apply a rule to a message, if that rule was valid return an object with valid true and the remaining message to be analized
function applyRule(ruleId: string, message: string, allRules: object) {
    var result: object = {valid: false, message: message};

    for (let i = 0; i < allRules[ruleId].length; i++) {
        const element = allRules[ruleId][i];
        let m:string = message;
        
        if (/\d/.test(element)) { // If is a number, apply the new rule
            let r = element.split(' ');
            for (let j = 0; j < r.length; j++) {
                let check: object = applyRule(r[j], m, allRules);
                if (check['valid']) {
                    m = check['message'];
                    result['message'] = check['message'];
                    result['valid'] = true;
                } else {
                    result['valid'] = false;
                    break;
                }
            }
            
        } else { // If is a character and it matches, return valid and the remaining message, otherwise the full message and valid false
            if (m.indexOf(element) === 0) {
                return {valid: true, message: m.substring(element.length)}
            } else {
                return {valid: false, message: message};
            }
        }
        if (result['valid']) return result;
        
    }

    return result;
}


async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
