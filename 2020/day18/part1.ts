import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var sum: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            // Add space between parenthesis, because the space is used later to split the string 
            // and all other elements of the expression are already separated by a blank space
            l = l.split('(').join('( ');
            l = l.split(')').join(' )');
            sum += calculateResult(l);
        })
        .on('close', function (err) {
            resolve(sum);
        })
    }); 
};

// Returns a string with the full expression between 2 valid parenthesis and the index of the next element outside of the parenthesis
// Can contain other parentheses inside  e.g. '2 + ( 1 * 3 + ( 1 + 4))'
function generateParenthesisExpression(terms: string[], index: number) {
    let subExpression: string = '';
    var parenthesisCount: number = 1;
    while (parenthesisCount !== 0) {
        if (terms[index] === '(') parenthesisCount++;
        if (terms[index] === ')') parenthesisCount--;
        if (parenthesisCount !== 0) {
            if (subExpression === '') {
                subExpression += terms[index];
            } else {
                subExpression += (' ' + terms[index]);
            }
        } 
        index++;
    }

    return {exp: subExpression, index: index};
}

// Calculate the result of an expression 
// Parenthesis have priority, everything else is executed in order from left to right
function calculateResult(expression: string) {
    var terms: string[] = expression.split(' ');
    if (terms.length == 1) return Number(terms[0]);

    var index: number = 1;
    var firstTerm: number;

    // Get the first term of the expression
    if (terms[0] === '(') {
        let p: object = generateParenthesisExpression(terms, index);
        index = p['index'];
        firstTerm = calculateResult(p['exp']);
    } else {
        firstTerm = Number(terms[0]);
    }

    // If there is nothing else to calculate, return the value
    if (index === terms.length) return firstTerm;

    // Check all elements of the expression
    // if found a parenthesis, calculate the result from the expression inside of it first and then continue the operations
    for (let i = (index + 1); i < terms.length; i++) {
        if (terms[i] !== '(') {
            firstTerm = executeOperation(firstTerm, Number(terms[i]), terms[i - 1]);
            i++;
        } else {
            index = i + 1;
            let p: object = generateParenthesisExpression(terms, index);
            firstTerm = executeOperation(firstTerm, calculateResult(p['exp']), terms[i - 1]);
            i = p['index'];
        }
    }
    return firstTerm;
}

function executeOperation(firstTerm: number, secondTerm: number, operation: string) {
    if (operation === '+') return firstTerm + secondTerm;
    if (operation === '*') return firstTerm * secondTerm;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
