package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func getIncreases() int {
	// open file
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	// remember to close the file at the end of the program
	defer f.Close()

	scanner := bufio.NewScanner(f)
	increases := 0
	// The first value of the array is a completed sum and the value we will
	// compare against.
	// The remaining of the array is the sum still being completed for the
	// following values.
	sums := []int{0, 0, 0, 0}
	count := 0

	for scanner.Scan() {
		value, err := strconv.Atoi(scanner.Text())
		if err != nil {
			fmt.Println(err)
			os.Exit(2)
		}

		if count == 3 {
			// When reading a file we will add to all position of the sums array,
			// except the first (which is a already completed sum).
			for i := 1; i <= 3; i++ {
				sums[i] += value
			}

			// On this step we will have just completed the sum for the second
			// value of the array, so we can compare if it has increased compared
			// to the first value.
			if sums[1] > sums[0] {
				increases++
			}

			// Now we can slide the array, so the second value goes to the first
			// position and can be used for the next comparison.
			sums = append(sums[1:], 0)
		} else {
			// When first reading the file, we want to add the values
			// until we have a completed sum for the first value on the array.
			for i := 0; i <= count; i++ {
				sums[i] += value
			}
			count++
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return increases
}

func main() {
	fmt.Printf("Total increases: %d \n", getIncreases())
}
