package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Scanner struct {
	name    string
	x       int
	y       int
	z       int
	beacons []map[string]int
}

func initializeBeacon(c []string) map[string]int {
	d1, _ := strconv.Atoi(c[0])
	d2, _ := strconv.Atoi(c[1])
	d3, _ := strconv.Atoi(c[2])
	beacon := map[string]int{"number": 0, "d1": d1, "d2": d2, "d3": d3}
	return beacon
}

func getScannersReads() []Scanner {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	inputScanner := bufio.NewScanner(f)
	scanners := []Scanner{}
	scanner := Scanner{}

	for inputScanner.Scan() {
		value := inputScanner.Text()
		if value == "" {
			scanners = append(scanners, scanner)
			scanner = Scanner{}
		} else if len(strings.Split(value, " ")) == 4 {
			scanner.name = strings.Split(value, " ")[2]
			scanner.beacons = []map[string]int{}
		} else {
			coordinates := strings.Split(value, ",")
			beacon := initializeBeacon(coordinates)
			scanner.beacons = append(scanner.beacons, beacon)
		}
	}
	scanners = append(scanners, scanner)
	if err := inputScanner.Err(); err != nil {
		log.Fatal(err)
	}
	return scanners
}

func distanceBetweenBeacons(b1 map[string]int, b2 map[string]int) []int {
	distances := []int{getAbsDiff(b1["d1"], b2["d1"]),
		getAbsDiff(b1["d2"], b2["d2"]),
		getAbsDiff(b1["d3"], b2["d3"])}
	sort.Ints(distances)
	return distances
}

func getAbsDiff(v1 int, v2 int) int {
	return int(math.Abs(float64(v1 - v2)))
}

func contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func containsCoordinate(list []map[string]int, e map[string]int) bool {
	for _, a := range list {
		if a["x"] == e["x"] && a["y"] == e["y"] && a["z"] == e["z"] {
			return true
		}
	}
	return false
}

func getAllPossiblePositions(beacon map[string]int) []map[string]int {
	possiblePositions := []map[string]int{}

	// x,y,z
	position := map[string]int{"x": beacon["d1"], "y": beacon["d2"], "z": beacon["d3"]}
	possiblePositions = append(possiblePositions, position)

	// x,-z,y
	position = map[string]int{"x": beacon["d1"], "y": beacon["d3"] * (-1), "z": beacon["d2"]}
	possiblePositions = append(possiblePositions, position)

	// x,-y,-z
	position = map[string]int{"x": beacon["d1"], "y": beacon["d2"] * (-1), "z": beacon["d3"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// x,z,-y
	position = map[string]int{"x": beacon["d1"], "y": beacon["d3"], "z": beacon["d2"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -x,-y,z
	position = map[string]int{"x": beacon["d1"] * (-1), "y": beacon["d2"] * (-1), "z": beacon["d3"]}
	possiblePositions = append(possiblePositions, position)

	// -x,-z,-y
	position = map[string]int{"x": beacon["d1"] * (-1), "y": beacon["d3"] * (-1), "z": beacon["d2"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -x,y,-z
	position = map[string]int{"x": beacon["d1"] * (-1), "y": beacon["d2"], "z": beacon["d3"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -x,z,y
	position = map[string]int{"x": beacon["d1"] * (-1), "y": beacon["d3"], "z": beacon["d2"]}
	possiblePositions = append(possiblePositions, position)

	// -z,x,-y
	position = map[string]int{"x": beacon["d3"] * (-1), "y": beacon["d1"], "z": beacon["d2"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// y,x,-z
	position = map[string]int{"x": beacon["d2"], "y": beacon["d1"], "z": beacon["d3"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// z,x,y
	position = map[string]int{"x": beacon["d3"], "y": beacon["d1"], "z": beacon["d2"]}
	possiblePositions = append(possiblePositions, position)

	// -y,x,z
	position = map[string]int{"x": beacon["d2"] * (-1), "y": beacon["d1"], "z": beacon["d3"]}
	possiblePositions = append(possiblePositions, position)

	// z,-x,-y
	position = map[string]int{"x": beacon["d3"], "y": beacon["d1"] * (-1), "z": beacon["d2"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// y,-x,z
	position = map[string]int{"x": beacon["d2"], "y": beacon["d1"] * (-1), "z": beacon["d3"]}
	possiblePositions = append(possiblePositions, position)

	// -z,-x,y
	position = map[string]int{"x": beacon["d3"] * (-1), "y": beacon["d1"] * (-1), "z": beacon["d2"]}
	possiblePositions = append(possiblePositions, position)

	// -y,-x,-z
	position = map[string]int{"x": beacon["d2"] * (-1), "y": beacon["d1"] * (-1), "z": beacon["d3"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -y,-z,x
	position = map[string]int{"x": beacon["d2"] * (-1), "y": beacon["d3"] * (-1), "z": beacon["d1"]}
	possiblePositions = append(possiblePositions, position)

	// z,-y,x
	position = map[string]int{"x": beacon["d3"], "y": beacon["d2"] * (-1), "z": beacon["d1"]}
	possiblePositions = append(possiblePositions, position)

	// y,z,x
	position = map[string]int{"x": beacon["d2"], "y": beacon["d3"], "z": beacon["d1"]}
	possiblePositions = append(possiblePositions, position)

	// -z,y,x
	position = map[string]int{"x": beacon["d3"] * (-1), "y": beacon["d2"], "z": beacon["d1"]}
	possiblePositions = append(possiblePositions, position)

	// z,y,-x
	position = map[string]int{"x": beacon["d3"], "y": beacon["d2"], "z": beacon["d1"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -y,z,-x
	position = map[string]int{"x": beacon["d2"] * (-1), "y": beacon["d3"], "z": beacon["d1"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// -z,-y,-x
	position = map[string]int{"x": beacon["d3"] * (-1), "y": beacon["d2"] * (-1), "z": beacon["d1"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	// y,-z,-x
	position = map[string]int{"x": beacon["d2"], "y": beacon["d3"] * (-1), "z": beacon["d1"] * (-1)}
	possiblePositions = append(possiblePositions, position)

	return possiblePositions
}

func getPossibleCoordinates(coordinates []map[string]int, beacon map[string]int, positions []map[string]int) []map[string]int {
	updatedCoordinates := []map[string]int{}

	for i := 0; i < len(positions); i++ {
		coordinate := map[string]int{}
		coordinate["x"] = beacon["d1"] - positions[i]["x"]
		coordinate["y"] = beacon["d2"] - positions[i]["y"]
		coordinate["z"] = beacon["d3"] - positions[i]["z"]

		if (len(coordinates) == 0 || containsCoordinate(coordinates, coordinate)) && !containsCoordinate(updatedCoordinates, coordinate) {
			updatedCoordinates = append(updatedCoordinates, coordinate)
		}
	}

	return updatedCoordinates
}

func findScannerPosition(s1 Scanner, s2 Scanner, beaconsS1Match []int, beaconsS2Match []int) (Scanner, Scanner) {
	if s2.x != 0 || s2.y != 0 && s2.z != 0 {
		return s1, s2
	}
	possibleValues := map[int][]int{}
	for i := 0; i < len(beaconsS2Match); i++ {
		possibleValues[beaconsS2Match[i]] = []int{}
	}

	for i := 0; i < len(beaconsS1Match); i++ {
		for j := 0; j < len(beaconsS1Match); j++ {
			if i == j {
				continue
			}
			iAux := beaconsS1Match[i]
			jAux := beaconsS1Match[j]
			distanceB1 := distanceBetweenBeacons(s1.beacons[iAux], s1.beacons[jAux])

			for k := 0; k < len(beaconsS2Match); k++ {
				for l := 0; l < len(beaconsS2Match); l++ {
					kAux := beaconsS2Match[k]
					lAux := beaconsS2Match[l]
					if k == l || (s2.beacons[kAux]["number"] != 0 && s2.beacons[lAux]["number"] != 0) {
						continue
					}
					distanceB2 := distanceBetweenBeacons(s2.beacons[kAux], s2.beacons[lAux])
					if distanceB1[0] == distanceB2[0] &&
						distanceB1[1] == distanceB2[1] &&
						distanceB1[2] == distanceB2[2] {
						if contains(possibleValues[kAux], i) {
							s2.beacons[kAux]["number"] = s1.beacons[iAux]["number"]
						} else {
							possibleValues[kAux] = append(possibleValues[kAux], iAux)
						}
						if contains(possibleValues[kAux], jAux) {
							s2.beacons[kAux]["number"] = s1.beacons[jAux]["number"]
						} else {
							possibleValues[kAux] = append(possibleValues[kAux], jAux)
						}

						if contains(possibleValues[lAux], iAux) {
							s2.beacons[lAux]["number"] = s1.beacons[iAux]["number"]
						} else {
							possibleValues[lAux] = append(possibleValues[lAux], iAux)
						}
						if contains(possibleValues[lAux], jAux) {
							s2.beacons[lAux]["number"] = s1.beacons[jAux]["number"]
						} else {
							possibleValues[lAux] = append(possibleValues[lAux], jAux)
						}
					}
				}
			}
		}
	}

	coordinates := []map[string]int{}

	for i := 0; i < len(s2.beacons); i++ {
		if s2.beacons[i]["number"] != 0 {
			beacon := map[string]int{}
			for j := 0; j < len(s1.beacons); j++ {
				if s2.beacons[i]["number"] == s1.beacons[j]["number"] {
					beacon = s1.beacons[j]
					break
				}
			}

			positions := getAllPossiblePositions(s2.beacons[i])
			coordinates = getPossibleCoordinates(coordinates, beacon, positions)
			if len(coordinates) == 1 {
				break
			}
		}
	}

	if s1.name == "0" && len(coordinates) == 1 {
		s2.x = coordinates[0]["x"]
		s2.y = coordinates[0]["y"]
		s2.z = coordinates[0]["z"]
	} else if len(coordinates) == 1 {
		s2.x = s1.x - coordinates[0]["x"]
		s2.y = s1.y + coordinates[0]["y"]
		s2.z = s1.z - coordinates[0]["z"]
	}

	return s1, s2
}

func matchBeacons(s1 Scanner, s2 Scanner, beaconsCount int) (Scanner, Scanner, int) {
	beaconsS1Match := []int{}
	beaconsS2Match := []int{}
	for i := 0; i < len(s1.beacons); i++ {
		for j := 0; j < len(s1.beacons); j++ {
			if i == j {
				continue
			}
			distanceB1 := distanceBetweenBeacons(s1.beacons[i], s1.beacons[j])

			for k := 0; k < len(s2.beacons); k++ {
				for l := 0; l < len(s2.beacons); l++ {
					if k == l {
						continue
					}
					distanceB2 := distanceBetweenBeacons(s2.beacons[k], s2.beacons[l])

					if distanceB1[0] == distanceB2[0] &&
						distanceB1[1] == distanceB2[1] &&
						distanceB1[2] == distanceB2[2] {

						if !contains(beaconsS1Match, i) {
							beaconsS1Match = append(beaconsS1Match, i)
						}
						if !contains(beaconsS1Match, j) {
							beaconsS1Match = append(beaconsS1Match, j)
						}
						if !contains(beaconsS2Match, k) {
							beaconsS2Match = append(beaconsS2Match, k)
						}
						if !contains(beaconsS2Match, l) {
							beaconsS2Match = append(beaconsS2Match, l)
						}
					}
				}
			}
		}
	}

	// fmt.Printf("Comparing %s %s: %d\n", s1.name, s2.name, len(beaconsS2Match))
	for i := 0; i < len(beaconsS1Match); i++ {
		if s1.beacons[beaconsS1Match[i]]["number"] == 0 {
			beaconsCount++
			s1.beacons[beaconsS1Match[i]]["number"] = beaconsCount
		}
	}
	if s2.x == 0 {
		s1, s2 = findScannerPosition(s1, s2, beaconsS1Match, beaconsS2Match)
	}
	return s1, s2, beaconsCount
}

func getLargestManhattanDistance(scanners []Scanner) int {
	maxValue := 0

	for i := 0; i < len(scanners); i++ {
		s1 := scanners[i]
		for j := 0; j < len(scanners); j++ {
			if i == j {
				continue
			}
			s2 := scanners[j]
			value := getAbsDiff(s1.x, s2.x) + getAbsDiff(s1.y, s2.y) + getAbsDiff(s1.z, s2.z)
			if value > maxValue {
				maxValue = value
			}
		}
	}

	return maxValue
}

func allFound(scanners []Scanner) bool {
	for i := 1; i < len(scanners); i++ {
		if scanners[i].x == 0 && scanners[i].y == 0 && scanners[i].z == 0 {
			return false
		}
	}
	return true
}

func main() {
	scanners := getScannersReads()
	beaconsCount := 0
	scanners[0].x = 0
	scanners[0].y = 0
	scanners[0].z = 0

	for !allFound(scanners) {
		for i := 0; i < len(scanners); i++ {
			for j := 1; j < len(scanners); j++ {
				if (i == j) || (i > 0 && scanners[i].x == 0) || scanners[j].x != 0 {
					continue
				}
				scanners[i], scanners[j], beaconsCount = matchBeacons(scanners[i], scanners[j], beaconsCount)
			}
		}
	}

	for i := 0; i < len(scanners); i++ {
		fmt.Printf("Scanner %s: (%d,%d,%d)\n", scanners[i].name, scanners[i].x, scanners[i].y, scanners[i].z)
	}

	fmt.Printf("Largest Manhattan Distance: %d\n", getLargestManhattanDistance(scanners))
}
