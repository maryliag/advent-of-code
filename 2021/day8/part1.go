package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func getCountUnique() int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	count := 0

	for scanner.Scan() {
		values := strings.Split(strings.Split(scanner.Text(), " | ")[1], " ")
		for i := 0; i < len(values); i++ {
			l := len(values[i])
			// 1 have 2 segments
			// 4 have 4 segments
			// 7 have 3 segments
			// 8 have 7 segments
			if l == 2 || l == 3 || l == 4 || l == 7 {
				count++
			}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return count
}

func main() {
	count := getCountUnique()
	fmt.Printf("Number of 1, 4, 7 and 8 appearences: %d\n", count)
}
