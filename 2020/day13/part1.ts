import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var start: number;
    var busesInfo: string[];
    var buses: object[];
    var bus: object;
    var line: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (line === 0) {
                start = Number(l);
            } else {
                busesInfo = l.split(',');
            }
            line++;
        })
        .on('close', function (err) {
            buses = cleanUpBuses(busesInfo);
            bus = smallestTs(start, buses);
            resolve((bus['earliest'] - start) * bus['id']);
        })
    }); 
};

function cleanUpBuses(busesComplete:string[]) {
    var buses: object[] = [];
    for (let i = 0; i < busesComplete.length; i++) {
        if (busesComplete[i] != 'x') {
            buses.push({id: Number(busesComplete[i]), earliest: 0});
        }
    }
    return buses;
}

function smallestTs(ts:number, buses: object[]) {
    var smallest: number = buses[0]['id'] * (Math.floor(ts / buses[0]['id']) + 1);
    var bus: object = buses[0];

    for (let i = 0; i < buses.length; i++) {
        buses[i]['earliest'] = buses[i]['id'] * (Math.floor(ts / buses[i]['id']) + 1);
        if (buses[i]['earliest'] < smallest) {
            smallest = buses[i]['earliest'];
            bus = buses[i];
        }
    }

    return bus;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
