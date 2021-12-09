package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"reflect"
	"sort"
	"strings"
)

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func intersectionCount(s1 []string, s2 []string) int {
	count := 0
	for _, e := range s1 {
		if contains(s2, e) {
			count++
		}
	}
	return count
}

func decodeNumber(input []string, output []string) int {
	decodedOutput := make([]int, 4, 4)
	values := map[int][]string{0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}}
	fiveSegments := [][]string{}
	sixSegments := [][]string{}

	for i := 0; i < len(input); i++ {
		segments := strings.Split(input[i], "")
		sort.Strings(segments)
		switch len(segments) {
		case 2:
			values[1] = segments
		case 3:
			values[7] = segments
		case 4:
			values[4] = segments
		case 5:
			fiveSegments = append(fiveSegments, segments)
		case 6:
			sixSegments = append(sixSegments, segments)
		case 7:
			values[8] = segments
		}
	}
	// At this point we know the segments for 1, 4, 7, 8.
	// We have values 2, 3, 5 with 5 segments and
	// values 0, 6, 9 with 6 segments.

	// Differentiate between 2, 3, 5
	for i := 0; i < len(fiveSegments); i++ {
		// 3 is the only one who contains all 2 segments of 1.
		if intersectionCount(values[1], fiveSegments[i]) == 2 {
			values[3] = fiveSegments[i]
		} else if intersectionCount(values[4], fiveSegments[i]) == 2 {
			// 2 intersect only 2 segments with 4.
			values[2] = fiveSegments[i]
		} else {
			values[5] = fiveSegments[i]
		}
	}

	// Differentiate between 0, 6, 9
	for i := 0; i < len(sixSegments); i++ {
		// 0 is the only one who contains only 4 segment intersections with 5.
		if intersectionCount(values[5], sixSegments[i]) == 4 {
			values[0] = fiveSegments[i]
		} else if intersectionCount(values[3], sixSegments[i]) == 5 {
			// 9 is the only one who contains all 5 segments of 3.
			values[9] = sixSegments[i]
		} else {
			values[6] = sixSegments[i]
		}
	}

	// Having all list of segments for all numbers, decode the output
	for i := 0; i < len(output); i++ {
		segments := strings.Split(output[i], "")
		sort.Strings(segments)
		for j := 0; j <= 9; j++ {
			if reflect.DeepEqual(values[j], segments) {
				decodedOutput[i] = j
			}
		}
	}

	// At this point we have the array of decoded numbers, and we
	// will generate the final number.
	// E.g. [2, 7, 5]
	// 5*1 + 7*10 + 2*100 = 275
	number := 0
	multiple := 1
	for i := len(decodedOutput) - 1; i >= 0; i-- {
		number += decodedOutput[i] * multiple
		multiple *= 10
	}

	return number
}

func getTotalSum() int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	sum := 0

	for scanner.Scan() {
		values := strings.Split(scanner.Text(), " | ")
		sum += decodeNumber(strings.Split(values[0], " "), strings.Split(values[1], " "))
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return sum
}

func main() {
	sum := getTotalSum()
	fmt.Printf("Total Sum: %d\n", sum)
}
