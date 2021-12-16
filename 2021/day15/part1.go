package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

func getCaveRiskLevels() [][]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	caveMap := [][]int{}

	for scanner.Scan() {
		value := strings.Split(scanner.Text(), "")
		line := []int{}
		for i := 0; i < len(value); i++ {
			level, _ := strconv.Atoi(value[i])
			line = append(line, level)
		}
		caveMap = append(caveMap, line)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return caveMap
}

// Check if this position existing on the matrix size.
func possible(sizeX int, sizeY int, i int, j int) bool {
	if i < 0 || j < 0 || i >= sizeX || j >= sizeY {
		return false
	}
	return true
}

// Add one to each surrounding position of a flash.
func getNeighbours(position string, sizeX int, sizeY int) []string {
	p := strings.Split(position, ",")
	i, _ := strconv.Atoi(p[0])
	j, _ := strconv.Atoi(p[1])
	positions := []string{}

	if possible(sizeX, sizeY, i, j-1) {
		positions = append(positions, fmt.Sprintf("%d,%d", i, j-1))
	}
	if possible(sizeX, sizeY, i-1, j) {
		positions = append(positions, fmt.Sprintf("%d,%d", i-1, j))
	}
	if possible(sizeX, sizeY, i+1, j) {
		positions = append(positions, fmt.Sprintf("%d,%d", i+1, j))
	}
	if possible(sizeX, sizeY, i, j+1) {
		positions = append(positions, fmt.Sprintf("%d,%d", i, j+1))
	}
	return positions
}

func heuristic(position string, endX int, endY int) int {
	p := strings.Split(position, ",")
	x, _ := strconv.Atoi(p[0])
	y, _ := strconv.Atoi(p[1])

	return endX - x + endY - y
}

func findLowestScoreNode(openSet []string, scores map[string]int) string {
	node := "0,0"
	lowesScore := math.MaxInt
	for i := 0; i < len(openSet); i++ {
		if scores[openSet[i]] < lowesScore {
			lowesScore = scores[openSet[i]]
			node = openSet[i]
		}
	}
	return node
}

func remove(slice []string, s string) []string {
	for i := 0; i < len(slice); i++ {
		if slice[i] == s {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

func getRiskLevel(position string, caveMap [][]int) int {
	p := strings.Split(position, ",")
	i, _ := strconv.Atoi(p[0])
	j, _ := strconv.Atoi(p[1])

	return caveMap[i][j]
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func main() {
	caveMap := getCaveRiskLevels()
	start := "0,0"
	goal := fmt.Sprintf("%d,%d", len(caveMap)-1, len(caveMap[0])-1)

	// The set of discovered nodes that may need to be (re-)expanded.
	// Initially, only the start node is known.
	// This is usually implemented as a min-heap or priority queue rather than a hash-set.
	openSet := []string{"0,0"}

	// For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
	// to n currently known.
	cameFrom := map[string]string{}

	// For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
	gScore := map[string]int{}
	for i := 0; i < len(caveMap); i++ {
		for j := 0; j < len(caveMap[0]); j++ {
			key := fmt.Sprintf("%d,%d", i, j)
			gScore[key] = math.MaxInt
		}
	}
	gScore[start] = 0

	// For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
	// how short a path from start to finish can be if it goes through n.
	fScore := map[string]int{}
	for i := 0; i < len(caveMap); i++ {
		for j := 0; j < len(caveMap[0]); j++ {
			key := fmt.Sprintf("%d,%d", i, j)
			fScore[key] = math.MaxInt
		}
	}
	fScore[start] = heuristic(start, len(caveMap), len(caveMap[0]))

	for len(openSet) > 0 {
		// This operation can occur in O(1) time if openSet is a min-heap or a priority queue
		current := findLowestScoreNode(openSet, fScore)
		if current == goal {
			fmt.Printf("Lowest Risk Level: %v\n", gScore[goal])
			break
		}

		openSet = remove(openSet, current)

		neighbours := getNeighbours(current, len(caveMap), len(caveMap[0]))

		for i := 0; i < len(neighbours); i++ {
			neighbor := neighbours[i]
			// tentative_gScore is the distance from start to the neighbor through current
			tentative_gScore := gScore[current] + getRiskLevel(neighbor, caveMap)
			if tentative_gScore < gScore[neighbor] {
				// This path to neighbor is better than any previous one. Record it!
				cameFrom[neighbor] = current
				gScore[neighbor] = tentative_gScore
				fScore[neighbor] = tentative_gScore + heuristic(neighbor, len(caveMap), len(caveMap[0]))
				if !contains(openSet, neighbor) {
					openSet = append(openSet, neighbor)
				}
			}

		}
	}
}
