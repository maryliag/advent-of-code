import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<string> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allergens: object = {};

    return new Promise<string>(resolve => {
        reader.on("line", (l: string) => {
            addAlergen(l.substr(0, l.length - 1), allergens);
        })
        .on('close', function (err) {
            solveAllAllergens(allergens);
            resolve(generateCanonicalDangerous(allergens));
        })
    }); 
};

function addAlergen(info:string, allergens: object) {
    let allergensKey: string[] = info.split('contains ')[1].split(', ');
    let ingredients: string[] = info.split(' (')[0].split(' ');
    let aux: string[] = [];
    for (let i = 0; i < allergensKey.length; i++) {
        aux = [];
        for (let j = 0; j < ingredients.length; j++) {
            aux.push(ingredients[j]);
        }

        // Since allergen and ingredient has a 1:1 relation, whenever we get a new list of possible ingredients, 
        // update the current list with the intersection of both
        if (allergens[allergensKey[i]]) {
            allergens[allergensKey[i]] = allergens[allergensKey[i]].filter(x => aux.includes(x))
        } else {
            allergens[allergensKey[i]] = aux;
        }
    }
}

// Check each allergen, if they have only one solution, remove that solution from all other allergens
function solveAllAllergens(allergens: object) {
    while (!hasOneSolutions(allergens) ) {
        let keys: string[] = Object.keys(allergens);
        for (let i = 0; i < keys.length; i++) {
            if (allergens[keys[i]].length === 1) removeIngredient(allergens, allergens[keys[i]][0], keys[i]);
        }
    }
}

function hasOneSolutions(allergens: object) {
    let keys: string[] = Object.keys(allergens);
    for (let i = 0; i < keys.length; i++) {
        if (allergens[keys[i]].length > 1) return false;
    }
    return true;
}

function removeIngredient(allergens: object, ingredient: string, notRemove: string) {
    let keys: string[] = Object.keys(allergens);

    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === notRemove) continue;
        const index = allergens[keys[i]].indexOf(ingredient);
        if (index > -1) {
            allergens[keys[i]].splice(index, 1);
        }
    }
}

// Generate list of ingredients order alphabetically by their allergen
function generateCanonicalDangerous(allergens: object) {
    let keys: string[] = Object.keys(allergens).sort();
    var s: string = allergens[keys[0]];
    for (let i = 1; i < keys.length; i++) {
        s += ',' + allergens[keys[i]];
    }

    return s;
}

async function solveChallenge() {
    var s: string =  await getResult();
    console.log("Result: ", s);
}

solveChallenge();
