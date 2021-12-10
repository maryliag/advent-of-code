package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
)

func getMap() [][]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	heightMap := [][]int{}

	for scanner.Scan() {
		lineString := strings.Split(scanner.Text(), "")
		line := []int{}

		for i := 0; i < len(lineString); i++ {
			value, _ := strconv.Atoi(lineString[i])
			line = append(line, value)
		}
		heightMap = append(heightMap, line)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return heightMap
}

func isLowPoint(heightMap [][]int, i int, j int) bool {
	point := heightMap[i][j]
	// Equals will check for the case where all values are the same.
	equals := true
	// Check up
	if i-1 >= 0 {
		if heightMap[i-1][j] < point {
			return false
		}
		if heightMap[i-1][j] != point {
			equals = false
		}
	}

	// Check down
	if i+1 < len(heightMap) {
		if heightMap[i+1][j] < point {
			return false
		}
		if heightMap[i+1][j] != point {
			equals = false
		}
	}

	// Check left
	if j-1 >= 0 {
		if heightMap[i][j-1] < point {
			return false
		}
		if heightMap[i][j-1] != point {
			equals = false
		}
	}

	// Check right
	if j+1 < len(heightMap[0]) {
		if heightMap[i][j+1] < point {
			return false
		}
		if heightMap[i][j+1] != point {
			equals = false
		}
	}

	// If none of the ones around are smaller and at least one of them
	// is different, then this is the lower point.
	return !equals
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func getPositions(heightMap [][]int, i int, j int, positions []string) []string {
	p := fmt.Sprintf("%d,%d", i, j)
	if !contains(positions, p) {
		positions = append(positions, p)
		ps := getBasinPositions(heightMap, positions, i, j)
		for k := 0; k < len(ps); k++ {
			if !contains(positions, ps[k]) {
				positions = append(positions, ps[k])
			}
		}
	}
	return positions
}

func getBasinPositions(heightMap [][]int, positions []string, i int, j int) []string {
	// Check up
	if i-1 >= 0 {
		if heightMap[i-1][j] != 9 {
			positions = getPositions(heightMap, i-1, j, positions)
		}
	}

	// Check down
	if i+1 < len(heightMap) {
		if heightMap[i+1][j] != 9 {
			positions = getPositions(heightMap, i+1, j, positions)
		}
	}

	// Check left
	if j-1 >= 0 {
		if heightMap[i][j-1] != 9 {
			positions = getPositions(heightMap, i, j-1, positions)
		}
	}

	// Check right
	if j+1 < len(heightMap[0]) {
		if heightMap[i][j+1] != 9 {
			positions = getPositions(heightMap, i, j+1, positions)
		}
	}

	return positions
}

func main() {
	heightMap := getMap()
	lowerPoints := [][]int{}
	for i := 0; i < len(heightMap); i++ {
		for j := 0; j < len(heightMap[i]); j++ {
			if isLowPoint(heightMap, i, j) {
				lowerPoints = append(lowerPoints, []int{i, j})
			}
		}
	}

	basinSizes := []int{}
	for i := 0; i < len(lowerPoints); i++ {
		position := fmt.Sprintf("%d,%d", lowerPoints[i][0], lowerPoints[i][1])
		basinSizes = append(basinSizes, len(getBasinPositions(heightMap, []string{position}, lowerPoints[i][0], lowerPoints[i][1])))
	}
	sort.Ints(basinSizes)
	basinCount := len(basinSizes)
	largestMultiplication := basinSizes[basinCount-1] * basinSizes[basinCount-2] * basinSizes[basinCount-3]

	fmt.Printf("Largest Multiplication: %v\n", largestMultiplication)
}
