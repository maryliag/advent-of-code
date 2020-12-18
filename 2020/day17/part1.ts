import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var pocket: object = {};
    var y: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            let values = l.split('');
            // For each cube create a new key with format x,y,z (z = 0 for the input)
            for (let x = 0; x < values.length; x++) {
                pocket[x + ',' + y + ',0'] = values[x];
            }
            y++;
        })
        .on('close', function (err) {
            // Run the cycle 6 times and return how many cubes are active
            for (let i = 1; i <= 6; i++) {
                pocket = runCycle(pocket);
            }
            resolve(activeCubes(pocket));
        })
    }); 
};

function runCycle(pocket:object) {
    pocket = addSurrounding(pocket);
    var active: number;

    var coordinates: string[] = Object.keys(pocket);
    for (let i = 0; i < coordinates.length; i++) {
        active = activeNeighbors(pocket, coordinates[i]);
        
        // Set pending states
        if (pocket[coordinates[i]] === '#' && active !== 2 && active !== 3) pocket[coordinates[i]] = 'DEACTIVATE';
        if (pocket[coordinates[i]] === '.' && active === 3) pocket[coordinates[i]] = 'ACTIVATE';
        
    }

    // Apply final values of pending states
    for (let i = 0; i < coordinates.length; i++) {
        if (pocket[coordinates[i]] === 'ACTIVATE') pocket[coordinates[i]] = '#';
        if (pocket[coordinates[i]] === 'DEACTIVATE') pocket[coordinates[i]] = '.';
    }

    return pocket;
}

// For each cube, add a new ket for each surrounding cube if it doesn't exists already
function addSurrounding(pocket:object) {
    var keys: string[] = Object.keys(pocket);
    var coordinates: string[];
    var newKey: string;

    for (let k = 0; k < keys.length; k++) {
        coordinates = keys[k].split(',');
        
        for (let xx = -1; xx <= 1; xx++) {
            for (let yy = -1; yy <= 1; yy++) {
                for (let zz = -1; zz <= 1; zz++) {
                    if (xx === 0 && yy === 0 && zz === 0) continue;
                    newKey = (Number(coordinates[0]) + xx) + ',' + (Number(coordinates[1]) + yy) + ',' + (Number(coordinates[2]) + zz);
                    if (keys.indexOf(newKey) < 0 ) pocket[newKey] = '.';
                }
            }
        }
    }  
    
    return pocket;
}

// Return a count of how many neighbors are active
function activeNeighbors(pocket:object, coordinates: string) {
    var c: string[] = coordinates.split(',');
    var count: number = 0;
    var positions: string[] = [];

    // Create list of all positions surrounding the cube being checked
    for (let xx = -1; xx <= 1; xx++) {
        for (let yy = -1; yy <= 1; yy++) {
            for (let zz = -1; zz <= 1; zz++) {
                if (xx === 0 && yy === 0 && zz === 0) continue;
                positions.push((Number(c[0]) + xx) + ',' + (Number(c[1]) + yy) + ',' + (Number(c[2]) + zz));
            }
        }
    }

    // Check if the value of each position is active (#) or on the pending state (DEACTIVATE), meaning is still currently active
    for (let i = 0; i < positions.length; i++) {
        if (pocket[positions[i]] === '#' || pocket[positions[i]] === 'DEACTIVATE') count++;
    }

    return count;
}

function activeCubes(pocket:object) {
    var z: string[] = Object.keys(pocket);
    var count: number = 0;
    for (let i = 0; i < z.length; i++) {
        if (pocket[z[i]] === '#') count++;
    }
    return count;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
