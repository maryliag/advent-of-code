function solveChallenge() {
    var min: number;
    var max: number;
    var input: string[] = '487912365'.split('');
    var cups: object = {}; // Object with the key as the cup number and the value the next cup
    let first: number;
    let prev: number = null;

    // Add the new cup to the object, with its next value
    for (let i = 0; i < input.length; i++) {
        let cup: number = Number(input[i]);
        if (i === 0) { 
            first = cup;
            min = cup;
            max = cup;
        } else {
            cups[prev] = cup;
            if (cup < min) {
                min = cup;
            }
            if (cup > max) {
                max = cup;
            }
        }

        if (i === input.length - 1) {
            cups[cup] = first;
        }
        prev = cup;
    }

    var moves: number = 1;
    var current: number = first;
    var picked: number[] = [];
    var destination: number;

    // Run 100 moves and return the cups following the cup 1
    while (moves <= 100) {
        picked = [];
        let aux: number = current;
        for (let i = 0; i < 3; i++) {
            picked.push(cups[aux]);
            aux = cups[aux];
        }

        let lookingDestination: boolean = true;
        destination = current - 1 < min ? max : current - 1;
        while (lookingDestination) {
            if (picked.includes(destination)) {
                destination = destination - 1 < min ? max : destination - 1;
            } else {
                lookingDestination = false;
            }
        }
        
        // Add the picked values right next to the destination cup
        // Update all values of `next` accordingly
        let nextAux: number = cups[destination];
        cups[current] = cups[picked[2]];
        cups[destination] = picked[0];
        cups[picked[2]] = nextAux;
        
        current = cups[current];
        moves++;
    }

    console.log("Result: ", getCups(1, cups));
}

// Return all the cups following the starting cup
function getCups(starting: number, cups: object) {
    var label: string = '';
    let id: number = cups[starting];
    while (id != starting) {
        label += id.toString();
        id = cups[id];
    }
    return label;
}



solveChallenge();
