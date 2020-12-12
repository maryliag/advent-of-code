import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));
var values:number[] = [];

function getResult() {
    reader.on("line", (n: number) => {
        n = Number(n); 
        let aux = findTwoValues(2020 - n, values);
        if (aux >= 0) {
            console.log("Result: ", n * aux);
            return;
        }
        values.push(n);
    })
};

function findTwoValues(added: number, possibles: number[]) {
    for (let i = 0; i < possibles.length; i++) {
        if (possibles.indexOf(added - possibles[i]) >= 0) return (possibles[i] * (added - possibles[i]));
    }
    return -1;
}

getResult();