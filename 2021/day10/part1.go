package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
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

func getIllegalCount() map[string]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	illegals := map[string]int{")": 0, "]": 0, "}": 0, ">": 0}

	for scanner.Scan() {
		illegal := firstIllegal(scanner.Text())
		if illegal != "" {
			illegals[illegal]++
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return illegals
}

func main() {
	illegals := getIllegalCount()
	syntaxErrorScore := illegals[")"]*3 + illegals["]"]*57 + illegals["}"]*1197 + illegals[">"]*25137

	fmt.Printf("Syntax Error Score: %d\n", syntaxErrorScore)
}
