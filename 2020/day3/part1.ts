import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./input.txt"));

function getResult() {
    var position: number = 0;
    var first: boolean = true;
    var treesCount = 0;
    reader.on("line", (l: string) => {
        // If is the first line of the file, just move 3 positions to the right, for all others check the value and then move
        // The pattern repeats, so move the rest of the division of the move by the length of the row
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