package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
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
	// Check up
	if i-1 >= 0 {
		if heightMap[i-1][j] <= point {
			return false
		}
	}

	// Check down
	if i+1 < len(heightMap) {
		if heightMap[i+1][j] <= point {
			return false
		}
	}

	// Check left
	if j-1 >= 0 {
		if heightMap[i][j-1] <= point {
			return false
		}
	}

	// Check right
	if j+1 < len(heightMap[0]) {
		if heightMap[i][j+1] <= point {
			return false
		}
	}

	return true
}

func main() {
	heightMap := getMap()
	totalRiskLevel := 0

	for i := 0; i < len(heightMap); i++ {
		for j := 0; j < len(heightMap[i]); j++ {
			if isLowPoint(heightMap, i, j) {
				totalRiskLevel += (1 + heightMap[i][j])
			}
		}
	}

	fmt.Printf("Total Risk Level: %v\n", totalRiskLevel)
}
