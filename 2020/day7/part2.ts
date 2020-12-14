import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allBags: object = {};
    var bag: Bag;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            bag = new Bag(l);
            allBags[bag.name] = bag;
        })
        .on('close', function (err) {
            var insideBags = countInsideBags('shiny gold', allBags['shiny gold'], allBags);
            resolve(insideBags);
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

    // Create a Bag with the name and the list of all contaning bags in it with their quantity
    constructor (info: string) {
        this.name = info.split(' bag')[0];
        this.contain = [];
        
        if (info.split(' contain ')[1] !== 'no other bags.') {
            var other: string[] = info.split(' contain ')[1].split(', ');
            var bag: object;
            for (let i = 0; i < other.length; i++) {
                bag = {qtd: Number(other[i].split(' ')[0]), type: other[i].substring(other[i].indexOf(' ') + 1).split(' bag')[0]};
                this.contain.push(bag);
            }
        } 
    }
}

function countInsideBags(type: string, bag: Bag, allBags: object) {
    var count: number = 0;
    for (let i = 0; i < bag.contain.length; i++) {
        // Each bag can carry their containing bags plus the containing bags * their own containing bags
        count += bag.contain[i]['qtd'] + bag.contain[i]['qtd'] * countInsideBags(type, allBags[bag.contain[i]['type']], allBags);
    }

    return count;
}

solveChallenge();
