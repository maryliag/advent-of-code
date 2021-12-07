package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func getInitialLanternfishes() map[int]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	lanternfishes := map[int]int{0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0}

	for scanner.Scan() {
		lanternfishesString := strings.Split(scanner.Text(), ",")
		for i := 0; i < len(lanternfishesString); i++ {
			value, _ := strconv.Atoi(lanternfishesString[i])
			lanternfishes[value]++
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return lanternfishes
}

func passDay(day int, lanternfishes map[int]int) map[int]int {
	updatedLanternfishes := map[int]int{}
	for i := 0; i < 8; i++ {
		updatedLanternfishes[i] = lanternfishes[i+1]
	}
	updatedLanternfishes[6] += lanternfishes[0]
	updatedLanternfishes[8] = lanternfishes[0]

	return updatedLanternfishes
}

func getTotalLanternfishes(lanternfishes map[int]int) int {
	count := 0
	for key := range lanternfishes {
		count += lanternfishes[key]
	}
	return count
}

func main() {
	lanternfishes := getInitialLanternfishes()
	days := 80
	for i := 0; i < days; i++ {
		lanternfishes = passDay(i, lanternfishes)
	}
	count := getTotalLanternfishes(lanternfishes)

	fmt.Printf("Total lanternfishes after %d days: %d\n", days, count)
}
