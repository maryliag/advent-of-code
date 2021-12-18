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

func getInput() string {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	input := ""

	for scanner.Scan() {
		characters := strings.Split(scanner.Text(), "")
		for _, value := range characters {
			binary, err := strconv.ParseUint(value, 16, 32)
			if err != nil {
				fmt.Printf("%s", err)
			}
			input = fmt.Sprintf("%s%04b", input, binary)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return input
}

func sumVersions(t string, remaining string) (int, string) {
	value := 0
	values := []int{}
	typeID, _ := strconv.ParseInt(t, 2, 64)
	if typeID == 4 {
		number := ""
		continueReading := true
		for continueReading {
			if remaining[:1] == "0" {
				continueReading = false
			}
			number += remaining[1:5]
			remaining = remaining[5:]
		}
		n, _ := strconv.ParseInt(number, 2, 64)
		value = int(n)
	} else {
		lengthTypeID := remaining[:1]
		remaining = remaining[1:]
		if lengthTypeID == "0" {
			totalLengthInBits, _ := strconv.ParseInt(remaining[:15], 2, 64)
			remaining = remaining[15:]
			lengthRead := 0
			for lengthRead != int(totalLengthInBits) {
				v, remainingAux := sumVersions(remaining[3:6], remaining[6:])
				lengthRead += (len(remaining) - len(remainingAux))
				remaining = remainingAux
				values = append(values, v)
			}
		} else {
			numberOfSubPackets, _ := strconv.ParseInt(remaining[:11], 2, 64)
			remaining = remaining[11:]

			for i := 0; i < int(numberOfSubPackets); i++ {
				v, remainingAux := sumVersions(remaining[3:6], remaining[6:])
				remaining = remainingAux
				values = append(values, int(v))
			}
		}
		switch typeID {
		case 0:
			for i := 0; i < len(values); i++ {
				value += values[i]
			}
		case 1:
			value = 1
			for i := 0; i < len(values); i++ {
				value *= values[i]
			}
		case 2:
			sort.Ints(values)
			value = values[0]
		case 3:
			sort.Ints(values)
			value = values[len(values)-1]
		case 5:
			if values[0] > values[1] {
				value = 1
			}
		case 6:
			if values[0] < values[1] {
				value = 1
			}
		case 7:
			if values[0] == values[1] {
				value = 1
			}
		}
	}

	return value, remaining
}

func main() {
	input := getInput()
	value, _ := sumVersions(input[3:6], input[6:])

	fmt.Printf("Final Value: %d\n", value)
}
