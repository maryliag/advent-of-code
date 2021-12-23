package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Box struct {
	xMin int
	xMax int
	yMin int
	yMax int
	zMin int
	zMax int
}

type Instruction struct {
	action string
	box    Box
}

func stringToInt(s string) int {
	value, _ := strconv.Atoi(s)
	return value
}

func getInstructions() []Instruction {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	instructions := []Instruction{}

	for scanner.Scan() {
		value := strings.Split(scanner.Text(), " ")
		limits := strings.Split(value[1], ",")
		x := strings.Split(limits[0][2:], "..")
		y := strings.Split(limits[1][2:], "..")
		z := strings.Split(limits[2][2:], "..")
		box := Box{xMin: stringToInt(x[0]),
			xMax: stringToInt(x[1]),
			yMin: stringToInt(y[0]),
			yMax: stringToInt(y[1]),
			zMin: stringToInt(z[0]),
			zMax: stringToInt(z[1])}
		instruction := Instruction{
			action: value[0],
			box:    box}
		instructions = append(instructions, instruction)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return instructions
}

func abs(number int) int {
	if number < 0 {
		return number * (-1)
	}
	return number
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func remove(slice []Box, s Box) []Box {
	for i := 0; i < len(slice); i++ {
		if slice[i] == s {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

func intersect(b1 Box, b2 Box) bool {
	if ((b1.xMin > b2.xMin && b1.xMin < b2.xMax) || (b1.xMax > b2.xMin && b1.xMax < b2.xMax) || (b2.xMin > b1.xMin && b2.xMin < b1.xMax)) &&
		((b1.yMin > b2.yMin && b1.yMin < b2.yMax) || (b1.yMax > b2.yMin && b1.yMax < b2.yMax) || (b2.yMin > b1.yMin && b2.yMin < b1.yMax)) &&
		((b1.zMin > b2.zMin && b1.zMin < b2.zMax) || (b1.zMax > b2.zMin && b1.zMax < b2.zMax) || (b2.zMin > b1.zMin && b2.zMin < b1.zMax)) {
		return true
	}
	return false
}

func generateNewBoxes(b1 Box, b2 Box, action string) []Box {
	boxes := []Box{}
	b1Boxes := []Box{b1}
	b2Boxes := []Box{b2}

	for len(b1Boxes) > 0 && len(b2Boxes) > 0 {
		for i := 0; i < len(b1Boxes); i++ {
			hasIntersection := false
			for j := 0; j < len(b2Boxes); j++ {
				if intersect(b1Boxes[i], b2Boxes[j]) {
					hasIntersection = true
					// Break the boxes
					break
				}
			}
			if !hasIntersection {
				boxes = append(boxes, b1Boxes[i])
				b1Boxes = remove(b1Boxes, b1Boxes[i])
			}
		}
	}
	boxes = append(boxes, b2Boxes...)

	return boxes
}

func executeInstruction(boxesON []Box, instruction Instruction) []Box {
	newBoxesON := []Box{}

	for i := 0; i < len(boxesON); i++ {
		if !(intersect(instruction.box, boxesON[i])) {
			newBoxesON = append(newBoxesON, instruction.box)
		} else {
			newBoxesON = append(newBoxesON, generateNewBoxes(instruction.box, boxesON[i], instruction.action)...)
		}
	}

	return newBoxesON
}

func totalCubes(boxes []Box) int {
	count := 0
	for i := 0; i < len(boxes); i++ {
		count += abs(boxes[i].xMax-boxes[i].xMin+1) *
			abs(boxes[i].yMax-boxes[i].yMin+1) *
			abs(boxes[i].zMax-boxes[i].zMin+1)
	}
	return count
}

func main() {
	instructions := getInstructions()
	boxesON := []Box{instructions[0].box}

	for i := 1; i < len(instructions); i++ {
		boxesON = executeInstruction(boxesON, instructions[i])
		// fmt.Printf("Cubes ON on Reactor After %+v: %d\n", instructions[i], totalCubes(boxesON))
	}

	fmt.Printf("Cubes ON on Reactor: %d\n", totalCubes(boxesON))
}

// 2,758,514,936,282,235
// 1,227,345,351,869,476
