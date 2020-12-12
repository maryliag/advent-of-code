import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));
var values:number[] = [];

function getResult() {
    var position: number = 0;
    var first: boolean = true;
    var treesCount = 0;
    reader.on("line", (l: string) => {
        if (first) {
            position = ((position + 3) % (l.length));
            first = false;
        } else {
            if (l.charAt(position) === '#') treesCount++;
            position = ((position + 3) % (l.length));
        }
    })
    .on('close', function (err) {
        console.log("Result: ", treesCount);
        return;
    })
};

getResult();