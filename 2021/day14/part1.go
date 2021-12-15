package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

// Returns a list of counter per pair of the polymer (e.g. {NH: 1, NN:2}),
// the pair insertion mapping and the character count.
func getInfo() (map[string]int, map[string]string, map[string]int) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	polymer := ""
	pairInsertion := map[string]string{}
	readingInsertions := false

	for scanner.Scan() {
		value := scanner.Text()
		if readingInsertions {
			insertion := strings.Split(value, " -> ")
			pairInsertion[insertion[0]] = insertion[1]
		} else if value == "" {
			readingInsertions = true
		} else {
			polymer = value
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	characters := strings.Split(polymer, "")
	charactersCount := map[string]int{}
	polymerCount := map[string]int{}
	for i := 0; i < len(characters)-1; i++ {
		key := fmt.Sprintf("%s%s", characters[i], characters[i+1])
		if polymerCount[key] > 0 {
			polymerCount[key]++
		} else {
			polymerCount[key] = 1
		}
		if charactersCount[characters[i]] > 0 {
			charactersCount[characters[i]]++
		} else {
			charactersCount[characters[i]] = 1
		}
	}

	if charactersCount[characters[len(characters)-1]] > 0 {
		charactersCount[characters[len(characters)-1]]++
	} else {
		charactersCount[characters[len(characters)-1]] = 1
	}

	return polymerCount, pairInsertion, charactersCount
}

// A step creates a new polymer counter, where uses the original count and replaces
// by two new pair with their intersection, for example:
// {NN: 1, NH: 2} with NN -> C, NH -> B, returns
// {NC: 1, CN: 1, NB: 2, BH: 2}
// This function also returns the current count of each character.
func step(pairInsertion map[string]string, polymerCount map[string]int, charactersCount map[string]int) (map[string]int, map[string]int) {
	newPolymerCount := map[string]int{}

	for key, value := range polymerCount {
		characters := strings.Split(key, "")

		newKey := fmt.Sprintf("%s%s", characters[0], pairInsertion[key])
		if newPolymerCount[newKey] > 0 {
			newPolymerCount[newKey] += value
		} else {
			newPolymerCount[newKey] = value
		}

		newKey = fmt.Sprintf("%s%s", pairInsertion[key], characters[1])
		if newPolymerCount[newKey] > 0 {
			newPolymerCount[newKey] += value
		} else {
			newPolymerCount[newKey] = value
		}

		if charactersCount[pairInsertion[key]] > 0 {
			charactersCount[pairInsertion[key]] += value
		} else {
			charactersCount[pairInsertion[key]] = value
		}
	}
	return newPolymerCount, charactersCount
}

// Find the max and min count and subtract them.
func getResult(counter map[string]int) int {
	max := 0
	min := -1

	for _, value := range counter {
		if value > max {
			max = value
		}
		if min == -1 || value < min {
			min = value
		}
	}
	return max - min
}

func main() {
	polymerCount, pairInsertion, charactersCount := getInfo()

	for i := 0; i < 10; i++ {
		polymerCount, charactersCount = step(pairInsertion, polymerCount, charactersCount)
	}

	result := getResult(charactersCount)
	fmt.Printf("Counter: %+v\nResult: %d\n", charactersCount, result)
}
