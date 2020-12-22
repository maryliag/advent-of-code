import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input2.txt"));
    var rules: object = {};
    var readingRules: boolean = true;
    var matches: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.length === 0) {
                readingRules = false;
            } 

            if (readingRules) {
                l = l.split('\"').join('');
                rules[l.split(':')[0]] = {rules: l.split(': ')[1].split(' | '), possible: []};
            } else {
                if (matchRule('0', l, rules)) matches++;
            }
        })
        .on('close', function (err) {
            resolve(matches);
        })
    }); 
};

// Return if a message matches the rule passed
function matchRule(ruleId:string, message: string, allRules: object) {
    if (message.length === 0 ) return false;

    let check: object = applyRule(ruleId, [message], allRules);
    if (check['valid']) {
        // Is valid only if there is one message with no more characters left
        for (let i = 0; i < check['messages'].length; i++) {
            if (check['messages'][i].length == 0) return true;
        }
        return false;
    } else {
        return false;
    }

}

// Apply a rule to a message, if that rule was valid return an object with valid true and the remaining message to be analized
function applyRule(ruleId: string, messages: string[], allRules: object) {
    var result: object = {valid: false, messages: []};
    for (let k = 0; k < messages.length; k++) {
        let m: string[];
        let lastCheck: boolean = false;

        for (let i = 0; i < allRules[ruleId]['rules'].length; i++) {
            const element = allRules[ruleId]['rules'][i];    
            m = [messages[k]];
            if (/\d/.test(element)) { // If is a number, apply the new rule
                let r = element.split(' ');
                for (let j = 0; j < r.length; j++) {
                    let check: object = applyRule(r[j], m, allRules);
                    if (check['valid']) {
                        m = check['messages'];
                        result['valid'] = true;
                        lastCheck = true;
                    } else {
                        if (result['messages'].length === 0) result['valid'] = false
                        lastCheck = false;
                        break;
                    }
                }
                
            } else { // If is a character and it matches, return valid and the remaining message, otherwise no message and valid false
                if (messages[k].indexOf(element) === 0) {
                    return {valid: true, messages: [messages[k].substring(element.length)]};
                } else {
                    return {valid: false, messages: []};
                }
            }
            // Since there are loops, several different matches are possible, so we need to keep checking the remaining matches for all possible left messages
            if (lastCheck) {
                result['messages'] = result['messages'].concat(m);
            } 
        }
    }
    
    return result;
}


async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
