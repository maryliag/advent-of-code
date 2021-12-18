package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
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

func sumVersions(v string, t string, remaining string, sum int) (int, string) {
	version, _ := strconv.ParseInt(v, 2, 64)
	sum += int(version)

	typeID, _ := strconv.ParseInt(t, 2, 64)
	if typeID == 4 {
		continueReading := true
		for continueReading {
			if remaining[:1] == "0" {
				continueReading = false
			}
			remaining = remaining[5:]
		}
	} else {
		lengthTypeID := remaining[:1]
		remaining = remaining[1:]
		if lengthTypeID == "0" {
			totalLengthInBits, _ := strconv.ParseInt(remaining[:15], 2, 64)
			remaining = remaining[15:]
			lengthRead := 0
			for lengthRead != int(totalLengthInBits) {
				sumAux, remainingAux := sumVersions(remaining[:3], remaining[3:6], remaining[6:], sum)
				lengthRead += (len(remaining) - len(remainingAux))
				sum = sumAux
				remaining = remainingAux
			}
		} else {
			numberOfSubPackets, _ := strconv.ParseInt(remaining[:11], 2, 64)
			remaining = remaining[11:]

			for i := 0; i < int(numberOfSubPackets); i++ {
				sumAux, remainingAux := sumVersions(remaining[:3], remaining[3:6], remaining[6:], sum)
				sum = sumAux
				remaining = remainingAux
			}
		}
	}

	return sum, remaining
}

func main() {
	input := getInput()
	sum, _ := sumVersions(input[:3], input[3:6], input[6:], 0)

	fmt.Printf("Sum of Versions: %d\n", sum)
}
