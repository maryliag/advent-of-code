package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"
)

func getCorrespondentCharacters(character string) string {
	switch character {
	case ")":
		return "("
	case "]":
		return "["
	case "}":
		return "{"
	case ">":
		return "<"
	case "(":
		return ")"
	case "[":
		return "]"
	case "{":
		return "}"
	case "<":
		return ">"
	}

	return ""
}

func firstIllegal(line string) string {
	illegal := ""
	charactersStack := []string{}
	characters := strings.Split(line, "")

	for i := 0; i < len(characters); i++ {
		if characters[i] == "(" || characters[i] == "[" || characters[i] == "{" || characters[i] == "<" {
			charactersStack = append(charactersStack, characters[i])
		} else {
			c := getCorrespondentCharacters(characters[i])
			if charactersStack[len(charactersStack)-1] != c {
				return characters[i]
			}
			charactersStack = charactersStack[:len(charactersStack)-1]
		}
	}
	return illegal
}

func getLegalLines() []string {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	lines := []string{}

	for scanner.Scan() {
		line := scanner.Text()
		illegal := firstIllegal(line)
		if illegal == "" {
			lines = append(lines, line)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return lines
}

func getPoints(character string) int {
	switch character {
	case ")":
		return 1
	case "]":
		return 2
	case "}":
		return 3
	case ">":
		return 4
	}

	return 0
}

func getClosingSequenceScore(line string) int {
	score := 0
	closingSequence := []string{}

	charactersStack := []string{}
	characters := strings.Split(line, "")

	for i := 0; i < len(characters); i++ {
		if characters[i] == "(" || characters[i] == "[" || characters[i] == "{" || characters[i] == "<" {
			charactersStack = append(charactersStack, characters[i])
		} else {
			charactersStack = charactersStack[:len(charactersStack)-1]
		}
	}

	for i := len(charactersStack) - 1; i >= 0; i-- {
		closingSequence = append(closingSequence, getCorrespondentCharacters(charactersStack[i]))
	}

	for i := 0; i < len(closingSequence); i++ {
		score *= 5
		score += getPoints(closingSequence[i])
	}
	return score
}

func main() {
	lines := getLegalLines()
	closingSequencesScores := []int{}
	for i := 0; i < len(lines); i++ {
		closingSequencesScores = append(closingSequencesScores, getClosingSequenceScore(lines[i]))
	}
	sort.Ints(closingSequencesScores)
	middle := len(closingSequencesScores) / 2

	fmt.Printf("Middle Score: %d\n", closingSequencesScores[middle])
}
