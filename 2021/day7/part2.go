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

func getCrabs() ([]int, int) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	crabs := []int{}
	max := 0

	for scanner.Scan() {
		crabsString := strings.Split(scanner.Text(), ",")
		for i := 0; i < len(crabsString); i++ {
			value, _ := strconv.Atoi(crabsString[i])
			crabs = append(crabs, value)
			if value > max {
				max = value
			}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return crabs, max
}

func main() {
	crabs, maxCrab := getCrabs()
	minFuel := -1
	// For each possible number, calculate the fuel cost
	for i := 0; i <= maxCrab; i++ {
		fuel := 0
		// Add the fuel cost for each crab to reach that position
		for c := 0; c < len(crabs); c++ {
			steps := int(math.Abs(float64(crabs[c] - i)))
			// Using Arithmetic Progression
			// An = A1 + (n - 1) * d  (d = 1 on this case)
			lastStepFuel := 1 + (steps - 1)
			// Sn = n * (A1 + An)/2
			totalFuelForCrab := (steps * (1 + lastStepFuel)) / 2

			fuel += totalFuelForCrab
		}
		if fuel < minFuel || minFuel == -1 {
			minFuel = fuel
		}
	}

	fmt.Printf("Min Fuel: %v\n", minFuel)
}
