import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allBags: object = {};
    var countPossible: number = 0;
    var bag: Bag;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            bag = new Bag(l);
            allBags[bag.name] = bag;
        })
        .on('close', function (err) {
            var keys: string[] = Object.keys(allBags);
            for (let i = 0; i < keys.length; i++) {
                // Look all bags if they can carry direct or indirectly a shiny gold bag 
                if (canCarry('shiny gold', allBags[keys[i]], allBags)) countPossible++;
            }
            resolve(countPossible);
        })
    }); 
};

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

class Bag {
    name: string;
    contain: object[];
    possible: boolean;

    // Create a Bag with the name and the list of all contaning bags in it with their quantity
    constructor (info: string) {
        this.name = info.split(' bag')[0];
        this.contain = [];
        
        if (info.split(' contain ')[1] !== 'no other bags.') {
            var other: string[] = info.split(' contain ')[1].split(', ');
            var bag: object;
            for (let i = 0; i < other.length; i++) {
                bag = {qtd: other[i].split(' ')[0], type: other[i].substring(other[i].indexOf(' ') + 1).split(' bag')[0]};
                this.contain.push(bag);
            }
        } 
    }
}

function canCarry(type: string, bag: Bag, allBags: object) {
    // If the ban doesn't contain any other, return false
    if (bag.contain.length == 0) {
        allBags[bag.name].possible = false;
        return false;
    }
    // Looking all bag contained on the parent bag
    for (let i = 0; i < bag.contain.length; i++) {
        // If we already know that the looked bag can possibly carry the looked bag, set the parent bag and return true
        if (bag.possible) {
            allBags[bag.name].possible = true;
            return true
        }
        // If the type of the looked bag is the type we're looking, set the parent bag and return true
        if (bag.contain[i]['type'] === type) {
            allBags[bag.name].possible = true;
            return true;
        }
        
        // Look for the the bags contained on the looked bag if they can carry the bag we're looking
        if (bag.possible === undefined) {
            if (canCarry(type, allBags[bag.contain[i]['type']], allBags)) {
                allBags[bag.name].possible = true;
                return true;
            }
        }
    }
    return false;
}

solveChallenge();
