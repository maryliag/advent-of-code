import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var instructions: object[] = [];

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            instructions.push({op: l.split(' ')[0], val: Number(l.split(' ')[1]), ran: false});
        })
        .on('close', function (err) {
            var result: object;

            // For each instruction, if is `nop` or `jmp` switch its value, and check if the program is valid. 
            // If it finds a loop, switch the instruction back and move to the next element of the instructions array
            for (let i = 0; i < instructions.length; i++) {
                if (instructions[i]['op'] === 'nop' || instructions[i]['op'] === 'jmp') {
                    switchValue(i, instructions);
                    result = containLoop(instructions);
                    
                    if (result['loop']) {
                        switchValue(i, instructions);
                    } else {
                        resolve(result['acc']);
                    }
                } 
            }

        })
    }); 
};

function switchValue (index, instructions) {
    if (instructions[index]['op'] === 'nop') {
        instructions[index]['op'] = 'jmp';
    } else if (instructions[index]['op'] === 'jmp') {
        instructions[index]['op'] = 'nop';
    }
}

// Return an object {loop: boolean, acc: number} with the result if it found a loop and the value of the accumulator when it stopped executing
function containLoop(inst) {
    var result: object = {loop: false, acc: 0};
    var index: number = 0;

    // Cleanup 
    for (let i = 0; i < inst.length; i++) {
        inst[i]['ran'] = false;
    }

    // Runs the program until it finds a loop or there isn't more isntructions to execute
    while (index < inst.length && !inst[index]['ran']) {
        inst[index]['ran'] = true;
        if (inst[index]['op'] === 'acc') {
            result['acc'] += inst[index]['val'];
            index++;
        } else if (inst[index]['op'] === 'nop') {
            index++;
        } else if (inst[index]['op'] === 'jmp') {
            index += inst[index]['val'];
        } 
    }

    if (index < inst.length) result['loop'] = true;
    return result;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
