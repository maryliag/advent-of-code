import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var players: object = {};
    var player: number = 1;

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            if (l.includes('Player')) {
                player = Number(l.substr(0, l.length - 1).split(' ')[1]);
                players[player] = [];
            } else if (l.length > 0) {
                players[player].push(Number(l));
            }
        })
        .on('close', function (err) {
            playGame(players);
            resolve(calculateScore(players));
        })
    }); 
};

// Play cards until one of the players doesn't have any cards left
function playGame(players: object) {
    while (getWinner(players) < 0) {
        let c1: number = players[1].shift();
        let c2: number = players[2].shift();

        if (c1 > c2) {
            players[1].push(c1);
            players[1].push(c2);
        } else {
            players[2].push(c2);
            players[2].push(c1);
        }
    }
}

function calculateScore(players: object) {
    var score: number = 0;
    var winner: number = getWinner(players);

    for (let i = 0; i < players[winner].length; i++) {
        score += players[winner][i] * (players[winner].length - i);
    }

    return score;
}

function getWinner(players: object) {
    if (players[1].length === 0) {
        return 2;
    } else if (players[2].length === 0){
        return 1;
    }
    return -1;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
