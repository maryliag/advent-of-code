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
	d1      string
	d2      string
	d3      string
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
	scanner := Scanner{d1: "", d2: "", d3: ""}

	for inputScanner.Scan() {
		value := inputScanner.Text()
		if value == "" {
			scanners = append(scanners, scanner)
			scanner = Scanner{d1: "", d2: "", d3: ""}
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

						beaconsS1Match = append(beaconsS1Match, i)
						beaconsS1Match = append(beaconsS1Match, j)
						beaconsS2Match = append(beaconsS2Match, k)
						beaconsS2Match = append(beaconsS2Match, l)
					}
				}
			}
		}
	}
	if len(beaconsS2Match) >= 12 {
		for i := 0; i < len(beaconsS1Match); i++ {
			if s1.beacons[beaconsS1Match[i]]["number"] == 0 {
				beaconsCount++
				s1.beacons[beaconsS1Match[i]]["number"] = 1
			}

		}
		for i := 0; i < len(beaconsS2Match); i++ {
			s2.beacons[beaconsS2Match[i]]["number"] = 1
		}
	}

	return s1, s2, beaconsCount
}

func namedMissingBeacons(s Scanner, beaconsCount int) (Scanner, int) {
	for i := 0; i < len(s.beacons); i++ {
		if s.beacons[i]["number"] == 0 {
			beaconsCount++
			s.beacons[i]["number"] = beaconsCount
		}
	}
	return s, beaconsCount
}

func main() {
	scanners := getScannersReads()
	beaconsCount := 0

	for i := 0; i < len(scanners); i++ {
		scanners[i], beaconsCount = namedMissingBeacons(scanners[i], beaconsCount)
		for j := i + 1; j < len(scanners); j++ {
			scanners[i], scanners[j], beaconsCount = matchBeacons(scanners[i], scanners[j], beaconsCount)
		}
	}

	fmt.Printf("Total Beacons: %d\n", beaconsCount)
}
