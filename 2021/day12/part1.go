package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

// Creates a map with the key of cave name and the value
// a list of all caves that are connected to it.
func getConnections() map[string][]string {
	f, err := os.Open("input2.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	connections := map[string][]string{}

	for scanner.Scan() {
		connection := strings.Split(scanner.Text(), "-")

		// No caves can go to "start", only "start" can go to other caves.
		if connection[1] != "start" {
			if connections[connection[0]] != nil {
				connections[connection[0]] = append(connections[connection[0]], connection[1])
			} else {
				connections[connection[0]] = []string{connection[1]}
			}
		}
		if connection[0] != "start" && connection[1] != "end" {
			if connections[connection[1]] != nil {
				connections[connection[1]] = append(connections[connection[1]], connection[0])
			} else {
				connections[connection[1]] = []string{connection[0]}
			}
		}

	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return connections
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func isSmallCave(cave string) bool {
	if cave == strings.ToUpper(cave) {
		return false
	}
	return true
}

func getAllPaths(connections map[string][]string, position string, smallCavesVisited []string) [][]string {
	allPaths := [][]string{}

	if position == "end" {
		end := []string{"end"}
		allPaths = append(allPaths, end)
		return allPaths
	}

	if isSmallCave(position) && !contains(smallCavesVisited, position) {
		smallCavesVisited = append(smallCavesVisited, position)
	}

	for i := 0; i < len(connections[position]); i++ {
		// Only continues creating paths if the current cave is not on the list
		// of small caves already visited
		if !contains(smallCavesVisited, connections[position][i]) {
			paths := getAllPaths(connections, connections[position][i], smallCavesVisited)
			for j := 0; j < len(paths); j++ {
				newPath := append([]string{position}, paths[j]...)
				allPaths = append(allPaths, newPath)
			}
		}
	}

	return allPaths
}

func main() {
	connections := getConnections()
	paths := getAllPaths(connections, "start", []string{})

	fmt.Printf("Total Path Count: %d\n", len(paths))
}
