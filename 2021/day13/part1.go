package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// Get the position of all dots and the list of instructions.
func getInfo() (map[string]string, [][]string) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	transparentPaper := map[string]string{}
	instructions := [][]string{}
	readingDots := true

	for scanner.Scan() {
		value := scanner.Text()
		if readingDots {
			if value == "" {
				readingDots = false
			} else {
				transparentPaper[value] = "#"
			}
		} else {
			instruction := strings.Split(strings.Split(value, "fold along ")[1], "=")
			instructions = append(instructions, []string{instruction[0], instruction[1]})
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return transparentPaper, instructions
}

func newPosition(foldType string, x int, y int, line int) string {
	positionX := 0
	positionY := 0
	// If is folding on X and the position of X is lower then the line,
	// return the same position.
	if foldType == "x" {
		if x < line {
			return fmt.Sprintf("%d,%d", x, y)
		}
		positionX = 1
	}
	// If is folding on Y and the position of Y is lower then the line,
	// return the same position.
	if foldType == "y" {
		if y < line {
			return fmt.Sprintf("%d,%d", x, y)
		}
		positionY = 1
	}
	// If the fold was on X, the Y value won't change and the X will change
	// to a new position, which is the current position minus the double of
	// the difference between the current value and the line.
	// The process is equivalent when folding Y.
	newX := x - (2*(x-line))*positionX
	newY := y - (2*(y-line))*positionY
	newKey := fmt.Sprintf("%d,%d", newX, newY)

	return newKey
}

func fold(transparentPaper map[string]string, foldType string, position string) map[string]string {
	foldedPaper := map[string]string{}

	line, _ := strconv.Atoi(position)

	for key := range transparentPaper {
		x, _ := strconv.Atoi(strings.Split(key, ",")[0])
		y, _ := strconv.Atoi(strings.Split(key, ",")[1])
		newKey := newPosition(foldType, x, y, line)
		foldedPaper[newKey] = "#"
	}

	return foldedPaper
}

func main() {
	transparentPaper, instructions := getInfo()
	// Part 1 only wants the first instruction executed
	transparentPaper = fold(transparentPaper, instructions[0][0], instructions[0][1])

	fmt.Printf("Total Dots: %d\n", len(transparentPaper))
}
