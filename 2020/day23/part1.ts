class Cup {
    id: number;
    next: number;

    constructor(id: number) {
        this.id = id;
    }
}

// Return all the cups following the starting cup
function getCups(starting: number, cups: object) {
    var label: string = '';
    let id: number = cups[starting].next;
    while (id != starting) {
        label += id.toString();
        id = cups[id].next;
    }
    return label;
}

function solveChallenge() {
    var min: number;
    var max: number;
    var input: string[] = '487912365'.split('');
    var cups: object = {};
    let first: number;
    let prev: number = null;

    // Add the new cup to the object, with its next value
    for (let i = 0; i < input.length; i++) {
        let cup: Cup = new Cup(Number(input[i]));
        if (i === 0) { 
            first = cup.id;
            min = cup.id;
            max = cup.id;
        } else {
            cups[prev].next = cup.id;
            if (cup.id < min) {
                min = cup.id;
            }
            if (cup.id > max) {
                max = cup.id;
            }
        }

        if (i === input.length - 1) {
            cup.next = first;
        }
        prev = cup.id;
        cups[input[i]] = cup;
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
            picked.push(cups[aux].next);
            aux = cups[aux].next;
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
        let nextAux: number = cups[destination].next;
        cups[current].next = cups[picked[2]].next;
        cups[destination].next = picked[0];
        cups[picked[2]].next = nextAux;
        
        current = cups[current].next;
        moves++;
    }

    console.log("Result: ", getCups(1, cups));
}

solveChallenge();
