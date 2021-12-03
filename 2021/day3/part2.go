package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func getValue(commonType string) string {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	numbers := []string{}
	for scanner.Scan() {
		numbers = append(numbers, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	position := 0
	for ok := true; ok; ok = len(numbers) > 1 { // do while
		numbers = calculateResult(commonType, numbers, position)
		position++
	}

	return numbers[0]
}

func calculateResult(commonType string, numbers []string, position int) []string {
	ones := []string{}
	zeros := []string{}

	for i := 0; i < len(numbers); i++ {
		number := []rune(numbers[i])
		if string(number[position]) == "0" {
			zeros = append(zeros, numbers[i])
		} else {
			ones = append(ones, numbers[i])
		}
	}

	if commonType == "most" {
		if len(ones) >= len(zeros) {
			return ones
		}
		return zeros
	} else {
		if len(zeros) <= len(ones) {
			return zeros
		}
		return ones
	}

}

func main() {
	oxygenGeneratorRating, err := strconv.ParseInt(getValue("most"), 2, 64)
	if err != nil {
		log.Fatal(err)
	}
	CO2ScrubberRating, err := strconv.ParseInt(getValue("least"), 2, 64)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Oxygen Generator Rating: %d\nCO2 Scrubber Rating: %d\nPower Consumption: %d\n", oxygenGeneratorRating, CO2ScrubberRating, oxygenGeneratorRating*CO2ScrubberRating)
}
