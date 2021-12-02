package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func getPosition() [2]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	position := [2]int{0, 0}

	for scanner.Scan() {
		instruction := strings.Fields(scanner.Text())
		value, err := strconv.Atoi(instruction[1])
		if err != nil {
			fmt.Println(err)
			os.Exit(2)
		}

		switch instruction[0] {
		case "forward":
			position[0] += value
		case "down":
			position[1] += value
		case "up":
			position[1] -= value
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return position
}

func main() {
	position := getPosition()
	fmt.Printf("Position \nHotizontal: %d\nDepth: %d\nMultiply: %d\n", position[0], position[1], position[0]*position[1])
}
