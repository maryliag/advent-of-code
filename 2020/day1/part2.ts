import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));
var values:number[] = [];

function getResult() {
    reader.on("line", (n: number) => {
        n = Number(n); 
        // For each new number check if the complementary of 2020 of that number is possible with the existing numbers on the array values
        let aux = findTwoValues(2020 - n, values);
        if (aux >= 0) {
            console.log("Result: ", n * aux);
            return;
        }
        values.push(n);
    })
};

// Look on the array is there are 2 number that can be added to get the `added` values
// If possible it returns the mutiplication of those 2 numbers, otherwise returns -1
function findTwoValues(added: number, possibles: number[]) {
    for (let i = 0; i < possibles.length; i++) {
        if (possibles.indexOf(added - possibles[i]) >= 0) return (possibles[i] * (added - possibles[i]));
    }
    return -1;
}

getResult();