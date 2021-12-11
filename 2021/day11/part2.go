package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func getInitialEnergyLevel() [][]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	energyLevels := [][]int{}
	for scanner.Scan() {
		line := []int{}
		energyLevelsString := strings.Split(scanner.Text(), "")
		for i := 0; i < len(energyLevelsString); i++ {
			number, _ := strconv.Atoi(energyLevelsString[i])
			line = append(line, number)
		}
		energyLevels = append(energyLevels, line)
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return energyLevels
}

func hasChange(values [][]int) bool {
	for i := 0; i < len(values); i++ {
		for j := 0; j < len(values[i]); j++ {
			if values[i][j] != 0 {
				return true
			}
		}
	}
	return false
}

// Check if this position existing on the matrix size.
func possible(size int, i int, j int) bool {
	if i < 0 || j < 0 || i >= size || j >= size {
		return false
	}
	return true
}

// Add one to each surrounding position of a flash.
func flashes(adding [][]int, i int, j int) [][]int {
	size := len(adding)
	positions := [][]int{}

	if possible(size, i-1, j-1) {
		positions = append(positions, []int{i - 1, j - 1})
	}
	if possible(size, i, j-1) {
		positions = append(positions, []int{i, j - 1})
	}
	if possible(size, i+1, j-1) {
		positions = append(positions, []int{i + 1, j - 1})
	}
	if possible(size, i-1, j) {
		positions = append(positions, []int{i - 1, j})
	}
	if possible(size, i+1, j) {
		positions = append(positions, []int{i + 1, j})
	}
	if possible(size, i-1, j+1) {
		positions = append(positions, []int{i - 1, j + 1})
	}
	if possible(size, i, j+1) {
		positions = append(positions, []int{i, j + 1})
	}
	if possible(size, i+1, j+1) {
		positions = append(positions, []int{i + 1, j + 1})
	}

	for i := 0; i < len(positions); i++ {
		p := positions[i]
		adding[p[0]][p[1]]++
	}
	return adding
}

func step(energyLevels [][]int) [][]int {
	// Each step starts with adding 1 to each position.
	adding := make([][]int, 10)
	for i := range adding {
		adding[i] = make([]int, 10)
	}
	for i := 0; i < 10; i++ {
		for j := 0; j < 10; j++ {
			adding[i][j] = 1
		}
	}

	// canFlash is used to identify if that position
	// already flashed, since each octupus can only
	// flash once per step.
	canFlash := make([][]bool, 10)
	for i := range adding {
		canFlash[i] = make([]bool, 10)
	}
	for i := 0; i < 10; i++ {
		for j := 0; j < 10; j++ {
			canFlash[i][j] = true
		}
	}
	firstStep := true

	// Keep adding while there is still things to be
	// added thanks to flashes.
	for hasChange(adding) || firstStep {
		firstStep = false
		for i := 0; i < 10; i++ {
			for j := 0; j < 10; j++ {
				energyLevels[i][j] += adding[i][j]
				if !canFlash[i][j] {
					energyLevels[i][j] = 0
				}
			}
		}

		for i := 0; i < 10; i++ {
			for j := 0; j < 10; j++ {
				adding[i][j] = 0
			}
		}
		for i := 0; i < 10; i++ {
			for j := 0; j < 10; j++ {
				// Only flashes if it haven't flashed
				// previously on this step.
				if energyLevels[i][j] > 9 && canFlash[i][j] {
					adding = flashes(adding, i, j)
					canFlash[i][j] = false
				}
			}
		}
	}

	return energyLevels
}

func main() {
	energyLevels := getInitialEnergyLevel()
	steps := 0

	for hasChange(energyLevels) {
		energyLevels = step(energyLevels)
		steps++
	}

	fmt.Printf("Steps: %d\n", steps)

}
