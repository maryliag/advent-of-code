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

func getTargetArea() map[string]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	xInfo := []string{}
	yInfo := []string{}

	for scanner.Scan() {
		input := strings.Split(scanner.Text(), "area: ")
		input = strings.Split(input[1], ", ")
		xInfo = strings.Split(input[0], "..")
		yInfo = strings.Split(input[1], "..")
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	xMin, _ := strconv.Atoi(xInfo[0][2:])
	xMax, _ := strconv.Atoi(xInfo[1])
	yMin, _ := strconv.Atoi(yInfo[0][2:])
	yMax, _ := strconv.Atoi(yInfo[1])

	return map[string]int{"xMin": xMin, "xMax": xMax, "yMin": yMin, "yMax": yMax}
}

func step(xPos int, yPos int, xVel int, yVel int) (int, int, int, int) {
	xPos += xVel
	yPos += yVel

	if xVel > 0 {
		xVel--
	} else if xVel < 0 {
		xVel++
	}
	yVel--

	return xPos, yPos, xVel, yVel
}

func isOnTarget(position map[string]int, target map[string]int) bool {
	if position["x"] >= target["xMin"] &&
		position["x"] <= target["xMax"] &&
		position["y"] >= target["yMin"] &&
		position["y"] <= target["yMax"] {
		return true
	}
	return false
}

func stillPossible(position map[string]int, target map[string]int) bool {
	if position["x"] > target["xMax"] || position["y"] < target["yMin"] {
		return false
	}
	return true
}

func main() {
	target := getTargetArea()

	maxVelocity := map[string]int{"x": 0, "y": 0}
	maxHeight := 0

	for i := 0; i <= target["xMax"]; i++ {
		for j := 0; j < int(math.Abs(float64(target["yMin"]))); j++ {
			position := map[string]int{"x": 0, "y": 0}
			velocity := map[string]int{"x": i, "y": j}
			maxHeightTemp := 0
			maxVelocityTemp := map[string]int{"x": i, "y": j}

			for stillPossible(position, target) && !isOnTarget(position, target) {
				position["x"], position["y"], velocity["x"], velocity["y"] = step(position["x"], position["y"], velocity["x"], velocity["y"])
				if position["y"] > maxHeightTemp {
					maxHeightTemp = position["y"]
				}
			}
			if isOnTarget(position, target) && maxHeightTemp > maxHeight {
				maxHeight = maxHeightTemp
				maxVelocity = maxVelocityTemp
			}

		}
	}

	fmt.Printf("Velocity (%d, %d) reached the max height: %+v\n", maxVelocity["x"], maxVelocity["y"], maxHeight)
}
