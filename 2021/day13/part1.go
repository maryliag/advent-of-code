package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// Get the position of all dots, the list of instructions
// and the max value for X and Y.
func getInfo() (map[string]string, [][]string, int, int) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	transparentPaper := map[string]string{}
	instructions := [][]string{}
	readingDots := true
	maxX := 0
	maxY := 0

	for scanner.Scan() {
		value := scanner.Text()
		if readingDots {
			if value == "" {
				readingDots = false
			} else {
				transparentPaper[value] = "#"
				position := strings.Split(value, ",")
				x, _ := strconv.Atoi(position[0])
				y, _ := strconv.Atoi(position[1])
				if x > maxX {
					maxX = x
				}
				if y > maxY {
					maxY = y
				}
			}
		} else {
			instruction := strings.Split(strings.Split(value, "fold along ")[1], "=")
			instructions = append(instructions, []string{instruction[0], instruction[1]})
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return transparentPaper, instructions, maxX, maxY
}

// Fold the paper and return the new folded paper and its max X and Y
func fold(transparentPaper map[string]string, direction string, position string, maxX int, maxY int) (map[string]string, int, int) {
	foldedPaper := map[string]string{}

	line, _ := strconv.Atoi(position)
	limitNotFoldedX := maxX
	limitNotFoldedY := maxY
	positionX := 0
	positionY := 0
	if direction == "x" {
		limitNotFoldedX = line - 1
		positionX = 1
	}
	if direction == "y" {
		limitNotFoldedY = line - 1
		positionY = 1
	}
	// For the part not folded, simply add the places
	// that have dot to the new folded paper.
	for x := 0; x <= limitNotFoldedX; x++ {
		for y := 0; y <= limitNotFoldedY; y++ {
			key := fmt.Sprintf("%d,%d", x, y)
			if transparentPaper[key] == "#" {
				foldedPaper[key] = "#"
			}
		}
	}

	// For the folded part, find the equivalent position
	// and add the dot on the folded paper.
	for x := maxX - limitNotFoldedX; x <= maxX; x++ {
		for y := maxY - limitNotFoldedY; y <= maxY; y++ {
			key := fmt.Sprintf("%d,%d", x, y)
			if transparentPaper[key] == "#" {
				// If the fold was on X, the Y value won't change
				// and the X will change to a new position, which is
				// the double of the difference between the line.
				// The process is equivalent on a fold on Y.
				newX := x - (2*(x-line))*positionX
				newY := y - (2*(y-line))*positionY
				newKey := fmt.Sprintf("%d,%d", newX, newY)
				foldedPaper[newKey] = "#"
			}
		}
	}

	return foldedPaper, limitNotFoldedX, limitNotFoldedY
}

func main() {
	transparentPaper, instructions, maxX, maxY := getInfo()
	// Part 1 only wants the first instruction executed
	transparentPaper, _, _ = fold(transparentPaper, instructions[0][0], instructions[0][1], maxX, maxY)

	fmt.Printf("Total Dots: %d\n", len(transparentPaper))
}
