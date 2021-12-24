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

// Check if two boxes intersect.
func intersect(b1 Box, b2 Box) bool {
	if b1.xMax < b2.xMin || b1.xMin > b2.xMax ||
		b1.yMax < b2.yMin || b1.yMin > b2.yMax ||
		b1.zMax < b2.zMin || b1.zMin > b2.zMax {
		return false
	}
	return true
}

// Check if the whole b1 box is inside b2 box.
func containBox(b1 Box, b2 Box) bool {
	if b1.xMin >= b2.xMin && b1.xMin <= b2.xMax &&
		b1.xMax >= b2.xMin && b1.xMax <= b2.xMax &&
		b1.yMin >= b2.yMin && b1.yMin <= b2.yMax &&
		b1.yMax >= b2.yMin && b1.yMax <= b2.yMax &&
		b1.zMin >= b2.zMin && b1.zMin <= b2.zMax &&
		b1.zMax >= b2.zMin && b1.zMax <= b2.zMax {
		return true
	}
	return false
}

// Break down the b Box into smaller boxes that do not intersect with
// instrucionBox.
func generateNewBoxes(box Box, instruction Instruction) []Box {
	boxes := []Box{}

	// Cut the extra X
	if instruction.box.xMin > box.xMin && instruction.box.xMin <= box.xMax {
		newBox := Box{xMin: box.xMin, xMax: instruction.box.xMin - 1, yMin: box.yMin, yMax: box.yMax, zMin: box.zMin, zMax: box.zMax}
		boxes = append(boxes, newBox)
		box.xMin = instruction.box.xMin
	}
	if instruction.box.xMax >= box.xMin && instruction.box.xMax < box.xMax {
		newBox := Box{xMin: instruction.box.xMax + 1, xMax: box.xMax, yMin: box.yMin, yMax: box.yMax, zMin: box.zMin, zMax: box.zMax}
		boxes = append(boxes, newBox)
		box.xMax = instruction.box.xMax
	}

	// Cut the extra Y
	if instruction.box.yMin > box.yMin && instruction.box.yMin <= box.yMax {
		newBox := Box{xMin: box.xMin, xMax: box.xMax, yMin: box.yMin, yMax: instruction.box.yMin - 1, zMin: box.zMin, zMax: box.zMax}
		boxes = append(boxes, newBox)
		box.yMin = instruction.box.yMin
	}
	if instruction.box.yMax >= box.yMin && instruction.box.yMax < box.yMax {
		newBox := Box{xMin: box.xMin, xMax: box.xMax, yMin: instruction.box.yMax + 1, yMax: box.yMax, zMin: box.zMin, zMax: box.zMax}
		boxes = append(boxes, newBox)
		box.yMax = instruction.box.yMax
	}

	// Cut the extra Z
	if instruction.box.zMin > box.zMin && instruction.box.zMin <= box.zMax {
		newBox := Box{xMin: box.xMin, xMax: box.xMax, yMin: box.yMin, yMax: box.yMax, zMin: box.zMin, zMax: instruction.box.zMin - 1}
		boxes = append(boxes, newBox)
		box.zMin = instruction.box.zMin
	}
	if instruction.box.zMax >= box.zMin && instruction.box.zMax < box.zMax {
		newBox := Box{xMin: box.xMin, xMax: box.xMax, yMin: box.yMin, yMax: box.yMax, zMin: instruction.box.zMax + 1, zMax: box.zMax}
		boxes = append(boxes, newBox)
		box.zMax = instruction.box.zMax
	}

	return boxes
}

func executeInstruction(boxesON []Box, instruction Instruction) []Box {
	newBoxesON := []Box{}
	// Check each existing box if they are affected by the instruction.
	for i := 0; i < len(boxesON); i++ {
		// If the box is entirely inside the instruction box, nothing needs to be done
		// for that box, since the instructionx box will be already added/removed.
		if !containBox(boxesON[i], instruction.box) {
			// If the box intersects, updates the list of boxes with the new broken down
			// boxes that don't intersect with the instruction box.
			if intersect(boxesON[i], instruction.box) {
				newBoxesON = append(newBoxesON, generateNewBoxes(boxesON[i], instruction)...)
			} else {
				newBoxesON = append(newBoxesON, boxesON[i])
			}
		}
	}
	// After all boxes are checked, add the instruction box if it's type "on"
	if instruction.action == "on" {
		newBoxesON = append(newBoxesON, instruction.box)
	}

	return newBoxesON
}

func totalCubes(boxes []Box) int {
	count := 0
	for i := 0; i < len(boxes); i++ {
		count += (abs(boxes[i].xMax-boxes[i].xMin) + 1) *
			(abs(boxes[i].yMax-boxes[i].yMin) + 1) *
			(abs(boxes[i].zMax-boxes[i].zMin) + 1)
	}
	return count
}

func main() {
	instructions := getInstructions()
	boxesON := []Box{instructions[0].box}

	for i := 1; i < len(instructions); i++ {
		boxesON = executeInstruction(boxesON, instructions[i])
	}

	fmt.Printf("Cubes ON on Reactor: %d\n", totalCubes(boxesON))
}
