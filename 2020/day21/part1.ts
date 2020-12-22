import * as fs from 'fs';
import * as rd from 'readline'

async function getResult(): Promise<number> {
    var reader = rd.createInterface(fs.createReadStream("./input.txt"));
    var allergens: object = {};
    var allIngredients: object = {};

    return new Promise<number>(resolve => {
        reader.on("line", (l: string) => {
            addAlergen(l.substr(0, l.length - 1), allergens, allIngredients);
        })
        .on('close', function (err) {
            resolve(countNotAllergen(allergens, allIngredients));
        })
    }); 
};

// Add allergen to the list and update the count for each ingredient
function addAlergen(info:string, allergens: object, allIngredients: object) {
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
    for (let i = 0; i < ingredients.length; i++) {
        if (allIngredients[ingredients[i]]) {
            allIngredients[ingredients[i]]++;
        } else {
            allIngredients[ingredients[i]] = 1;
        }
    }
}

// Return the amount of times each ingredient that does not contain an allergen appears
function countNotAllergen(allergens: object, allIngredients: object) {
    var count: number = 0;
    var aux: string[] = []
    var keys: string[] = Object.keys(allergens);

    // Create a list of all ingredients listed on any allergen
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < allergens[keys[i]].length; j++) {
            if (!aux.includes(allergens[keys[i]][j])) aux.push(allergens[keys[i]][j]);  
        }
    }

    keys = Object.keys(allIngredients);
    for (let i = 0; i < keys.length; i++) {
        if (!aux.includes(keys[i])) count += allIngredients[keys[i]];
    }

    return count;
}

async function solveChallenge() {
    var n: number =  await getResult();
    console.log("Result: ", n);
}

solveChallenge();
