package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func getIncreases() int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	increases := 0
	currValue := -1
	prevValue := -1

	for scanner.Scan() {
		if prevValue != -1 {
			currValue, err = strconv.Atoi(scanner.Text())
			if err != nil {
				fmt.Println(err)
				os.Exit(2)
			}
			if currValue > prevValue {
				increases++
			}

			prevValue = currValue
		} else {
			prevValue, err = strconv.Atoi(scanner.Text())
			if err != nil {
				fmt.Println(err)
				os.Exit(2)
			}
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
