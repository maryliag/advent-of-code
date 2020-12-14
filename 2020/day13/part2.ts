import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var busesInfo: string[];
    var buses: object[];
    var busesChecked: number[] = [];
    var line: number = 0;
    const gcd = (a: number, b: number) => a ? gcd(b % a, a) : b;
    const lcm = (a: number, b: number) => a * b / gcd(a, b);

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (line === 1) { // We only care about line with, with all the buses' ids
                busesInfo = l.split(',');
            }
            line++;
        })
        .on('close', function (err) {
            buses = cleanUpBuses(busesInfo);

            var firstBusTs: number = 0;
            var period: number = buses[0]['id'];
            busesChecked.push(buses[0]['id']);
            var bus: object;
            for (let j = 1; j < buses.length; j++) {
                bus = buses[j];
                // Look for the timestamp of the first bus where the ts of the first bus plus the diff from the bus we're current looking into 
                // is a multiple of the bus we're current looking into
                while ((firstBusTs + bus['diff']) % bus['id'] != 0) {
                    firstBusTs += period;
                }
                // The period starts as the id of first bus, but keeps been updated by the Least Common Multiple of all checked buses' ids 
                // to consider all buses we have looked into so far, so they keep aligned when looking into the next bus. 
                busesChecked.push(bus['id']);
                period = busesChecked.reduce(lcm);
            }
            resolve(firstBusTs);

        })
    }); 
};

// Only add valid buses (id != x) and save the diff we want compared to the first bus
function cleanUpBuses(busesComplete: string[]) {
    var buses: object[] = [];
    for (let i = 0; i < busesComplete.length; i++) {
        if (busesComplete[i] != 'x') {
            buses.push({id: Number(busesComplete[i]), diff: i});
        }
    }
    return buses;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();