package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Instruction struct {
	action string
	xMin   int
	xMax   int
	yMin   int
	yMax   int
	zMin   int
	zMax   int
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
		instruction := Instruction{
			action: value[0],
			xMin:   stringToInt(x[0]) + 50,
			xMax:   stringToInt(x[1]) + 50,
			yMin:   stringToInt(y[0]) + 50,
			yMax:   stringToInt(y[1]) + 50,
			zMin:   stringToInt(z[0]) + 50,
			zMax:   stringToInt(z[1]) + 50}
		instructions = append(instructions, instruction)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return instructions
}

func executeInstruction(reactor [101][101][101]int, instruction Instruction) [101][101][101]int {
	// fmt.Printf("Execution %+v\n", instruction)
	if instruction.xMin >= 101 ||
		instruction.xMax < 0 ||
		instruction.yMin >= 101 ||
		instruction.yMax < 0 ||
		instruction.zMin >= 101 ||
		instruction.zMax < 0 {
		return reactor
	}

	for x := instruction.xMin; x <= instruction.xMax; x++ {
		for y := instruction.yMin; y <= instruction.yMax; y++ {
			for z := instruction.zMin; z <= instruction.zMax; z++ {
				if x < 0 || x >= 101 || y < 0 || y >= 101 || z < 0 || z >= 101 {
					continue
				}
				if instruction.action == "on" {
					reactor[x][y][z] = 1
				} else {
					reactor[x][y][z] = 0
				}
			}
		}
	}
	return reactor
}

func ONCubesCount(reactor [101][101][101]int) int {
	count := 0
	for i := 0; i < 101; i++ {
		for j := 0; j < 101; j++ {
			for k := 0; k < 101; k++ {
				if reactor[i][j][k] == 1 {
					count++
				}
			}
		}
	}
	return count
}

// This reactor goes from -50 to 50, making a 101 cube size
func main() {
	reactor := [101][101][101]int{}
	instructions := getInstructions()

	for i := 0; i < len(instructions); i++ {
		reactor = executeInstruction(reactor, instructions[i])
	}

	fmt.Printf("Cubes ON on Reactor: %d\n", ONCubesCount(reactor))
}
