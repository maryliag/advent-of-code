import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var busesInfo: string[];
    var buses: object[];
    var line: number = 0;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (line === 1) {
                busesInfo = l.split(',');
            }
            line++;
        })
        .on('close', function (err) {
            buses = cleanUpBuses(busesInfo);

            var firstBusTs: number = 0;
            var period: number = buses[0]['id'];
            var bus: object;
            for (let j = 1; j < buses.length; j++) {
                bus = buses[j];
                while ((firstBusTs + bus['diff']) % bus['id'] != 0) {
                    firstBusTs += period;
                }
                period *= bus['id'];
            }
            resolve(firstBusTs);

        })
    }); 
};

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
