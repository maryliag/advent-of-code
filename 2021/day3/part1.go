package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func getCount() []int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	var count []int

	for scanner.Scan() {
		value := scanner.Text()
		if count == nil {
			count = make([]int, len(value), len(value))
		}

		for i, r := range value {
			if string(r) == "1" {
				count[i] += 1
			} else {
				count[i] -= 1
			}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return count
}

func main() {
	count := getCount()
	gammaRate := ""
	epsilonRate := ""

	for i := 0; i < len(count); i++ {
		if count[i] > 0 {
			gammaRate += "1"
			epsilonRate += "0"
		} else {
			gammaRate += "0"
			epsilonRate += "1"
		}
	}

	gamma, err := strconv.ParseInt(gammaRate, 2, 64)
	if err != nil {
		log.Fatal(err)
	}
	epsilon, err := strconv.ParseInt(epsilonRate, 2, 64)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Gamma Rate: %s (%d)\nEpsilon Rate: %s (%d)\nPower Consumption: %d\n", gammaRate, gamma, epsilonRate, epsilon, gamma*epsilon)
}
