import * as fs from 'fs';
import * as rd from 'readline';

class Cup {
    id: number;
    next: number;

    constructor(id: number) {
        this.id = id;
    }
}

// Return the multiplication of the next two cups after the starting cup
function getNext2Cups(starting: number, cups: object) {
    var cup1: number = cups[starting].next;
    var cup2: number = cups[cup1].next;

    console.log('Cup 1: ', cup1);
    console.log('Cup 2: ', cup2);

    return cup1 * cup2;
}

function solveChallenge() {
    var min: number = 1;
    var max: number = 9;
    var input: string[] = '487912365'.split('');

    // Add all values up to 1 million
    for (let i = max + 1; i <= 1000000; i++) {
        input.push(i.toString());
    }
    max = 1000000;
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

    // Run 10 million moves and return the multiplication of the next two cups after 1
    while (moves <= 10000000) {
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

    console.log("Result: ", getNext2Cups(1, cups));
}

solveChallenge();
