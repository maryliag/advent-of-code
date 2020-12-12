import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));
var values:number[] = [];

function getResult() {
    reader.on("line", (n: number) => {
        n = Number(n);        
        if (values.indexOf(2020 - n) >= 0) {
            console.log("Result: ", (n * (2020 - n)));
            return;
        }
        values.push(n);
    })
};

getResult();