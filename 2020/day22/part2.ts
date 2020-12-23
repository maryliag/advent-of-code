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

// Play cards until one of the players doesn't have more cards left
// or the hand already happened
function playGame(players: object) {
    var round: number = 1;
    
    var previousGames: string[] = [];
    var stopGame: boolean = false;

    while (getWinner(players, stopGame) < 0) {
        let newGame: string = players[1].toString() + '-' + players[2].toString();
        // If this exact hand already happened, player 1 wins
        if (!previousGames.includes(newGame)) {
            previousGames.push(newGame);

            let c1: number = players[1].shift();
            let c2: number = players[2].shift();

            // Check if a sub-game is possible and return the winner or -1 if it isn't possible
            let possibleWinner: number = checkAfterDraw(players, c1, c2);
            if (possibleWinner > 0) {
                if (possibleWinner == 1) {
                    players[1].push(c1);
                    players[1].push(c2);
                } else {
                    players[2].push(c2);
                    players[2].push(c1);
                }
            } else {
                if (c1 > c2) {
                    players[1].push(c1);
                    players[1].push(c2);
                    
                } else {
                    players[2].push(c2);
                    players[2].push(c1);
                }
            }
        } else {
            stopGame = true;
            break;
        }
        round++;
    }
}

function getWinner(players: object, gameEnded: boolean) {
    if (players[1].length === 0) {
        return 2;
    } else if (players[2].length === 0 || gameEnded){
        return 1;
    } 
    return -1;
}

// Run a sub-game if possible and return the winner
function checkAfterDraw(players: object, c1: number, c2: number) {
    var winner: number = -1;

    if (players[1].length >= c1 && players[2].length >= c2) {
        let p: object = {1: [], 2: []};
        for (let i = 0; i < c1; i++) {
            p[1].push(players[1][i]);
        }
        for (let i = 0; i < c2; i++) {
            p[2].push(players[2][i]);
        }
        playGame(p);
        return getWinner(p, true);
    }

    return winner;
}

function calculateScore(players: object) {
    var score: number = 0;
    var winner: number = getWinner(players, true);

    for (let i = 0; i < players[winner].length; i++) {
        score += players[winner][i] * (players[winner].length - i);
    }

    return score;
}


async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
