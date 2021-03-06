import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(right: number, down: number): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var position: number = 0;
    var first: boolean = true;
    var treesCount: number = 0;
    var checkLine: number = 0;
    
    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            // If is the first line of the file, just move the number of positions to the right
            // The pattern repeats, so move the rest of the division of the move by the length of the row
            if (first) {
                position = ((position + right) % (l.length));
                first = false;
                checkLine++;
            } else {
                // Only check the line if it wen down the right amount of times
                if (checkLine === down) {
                    if (l.charAt(position) === '#') treesCount++;
                    position = ((position + right) % (l.length));
                    checkLine = 0;
                }
                checkLine++;
            }
        })
        .on('close', function (err) {
            resolve(treesCount)
        })
    }); 
};

// Calculate the number of trees on the cases:
// Right 1, down 1.
// Right 3, down 1.
// Right 5, down 1.
// Right 7, down 1.
// Right 1, down 2.
async function getMultiplication() {
    var m: number =  await getResult(1, 1) * await getResult(3, 1) * await getResult(5, 1) * await getResult(7, 1) * await getResult(1, 2);
    console.log("Result: ", m);
}

getMultiplication();