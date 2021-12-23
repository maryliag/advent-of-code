package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func getInitialPositions() (int, int) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	p1 := 0
	p2 := 0

	for scanner.Scan() {
		value := strings.Split(scanner.Text(), "position: ")[1]
		if p1 == 0 {
			p1, _ = strconv.Atoi(value)
		} else {
			p2, _ = strconv.Atoi(value)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return p1, p2
}

func main() {
	p1, p2 := getInitialPositions()
	p1Points := 0
	p2Points := 0
	rolled := 0
	dice := 0
	turn := "1"

	for p1Points < 1000 && p2Points < 1000 {
		add := 0
		for i := 0; i < 3; i++ {
			dice++
			rolled++
			if dice > 100 {
				dice = 1
			}
			add += dice
		}

		if turn == "1" {
			p1 += add
			p1 = p1 % 10
			if p1 == 0 {
				p1 = 10
			}
			p1Points += p1
			turn = "2"
		} else {
			p2 += add
			p2 = p2 % 10
			if p2 == 0 {
				p2 = 10
			}
			p2Points += p2
			turn = "1"
		}
	}
	loser := p1Points
	if p2Points < p1Points {
		loser = p2Points
	}

	fmt.Printf("P1 points: %d \nP2 points: %d\nDice rolled: %d\nResult: %d\n", p1Points, p2Points, rolled, rolled*loser)
}
