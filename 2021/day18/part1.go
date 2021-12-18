package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

func getNumbersList() []string {
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
	return numbers
}

func explodes(n []string, position int) []string {
	exploded := []string{}
	for i := position; i > 0; i-- {
		if n[i] != "[" && n[i] != "]" && n[i] != "," {
			value, _ := strconv.Atoi(n[i])
			adding, _ := strconv.Atoi(n[position+1])
			value += adding
			n[i] = strconv.Itoa(value)
			break
		}
	}
	exploded = n[:position]
	exploded = append(exploded, "0")

	for i := position + 5; i < len(n); i++ {
		if n[i] != "[" && n[i] != "]" && n[i] != "," {
			value, _ := strconv.Atoi(n[i])
			adding, _ := strconv.Atoi(n[position+3])
			value += adding
			n[i] = strconv.Itoa(value)
			break
		}
	}
	exploded = append(exploded, n[position+5:]...)
	return exploded
}

func splits(value int, n []string, position int) []string {
	half := int(math.Floor(float64(value / 2)))
	sum := []string{}
	sum = append(sum, n[:position]...)
	sum = append(sum, "[")
	sum = append(sum, fmt.Sprintf("%d", half))
	sum = append(sum, ",")
	sum = append(sum, fmt.Sprintf("%d", value-half))
	sum = append(sum, "]")
	sum = append(sum, n[position+1:]...)
	return sum
}

func addNumbers(n1 []string, n2 []string) []string {
	n := strings.Split(fmt.Sprintf("[%s,%s]", strings.Join(n1, ""), strings.Join(n2, "")), "")
	changed := true
	countNested := 0

	for changed {
		changed = false
		countNested = 0
		for i := 0; i < len(n); i++ {
			if n[i] == "[" || n[i] == "]" {
				if n[i] == "[" {
					if countNested == 4 {
						n = explodes(n, i)
						changed = true
						break
					}
					countNested++
				}
				if n[i] == "]" {
					countNested--
				}
			}
		}
		if !changed {
			for i := 0; i < len(n); i++ {
				if n[i] != "[" && n[i] != "]" && n[i] != "," {
					value, _ := strconv.Atoi(n[i])
					if value >= 10 {
						n = splits(value, n, i)
						changed = true
						break
					}
				}
			}
		}
	}
	return n
}

func getMagnitude(number []string) string {
	magnitude := []string{}
	position := 0

	for len(magnitude) != 1 {
		magnitude = []string{}
		for i := 0; i < len(number)-4; i++ {
			if number[i] == "[" && number[i+2] == "," && number[i+4] == "]" {
				n1, _ := strconv.Atoi(number[i+1])
				n2, _ := strconv.Atoi(number[i+3])
				m := 3*n1 + 2*n2
				magnitude = append(magnitude, fmt.Sprintf("%d", m))
				i += 4
			} else {
				magnitude = append(magnitude, number[i])
			}
			position = i
		}
		position++
		if position < len(number) {
			magnitude = append(magnitude, number[position:]...)
		}
		number = magnitude
	}
	return magnitude[0]
}

func main() {
	numbers := getNumbersList()
	number := strings.Split(numbers[0], "")

	for i := 1; i < len(numbers); i++ {
		number = addNumbers(number, strings.Split(numbers[i], ""))
	}
	magnitude := getMagnitude(number)
	fmt.Printf("Magnitude: %s\nSnailfish Number: %s\n", magnitude, strings.Join(number, ""))
}
