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
    if (bag.contain.length == 0) {
        allBags[bag.name].possible = false;
        return false;
    }
    for (let i = 0; i < bag.contain.length; i++) {
        if (bag.possible) {
            allBags[bag.name].possible = true;
            return true
        }
        if (bag.contain[i]['type'] === type) {
            allBags[bag.name].possible = true;
            return true;
        }
        
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
