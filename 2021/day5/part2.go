package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Line struct {
	x1 int
	y1 int
	x2 int
	y2 int
}

func getLine(text string) Line {
	values := strings.Split(text, " -> ")
	start := strings.Split(values[0], ",")
	end := strings.Split(values[1], ",")

	startX, _ := strconv.Atoi(start[0])
	startY, _ := strconv.Atoi(start[1])
	endX, _ := strconv.Atoi(end[0])
	endY, _ := strconv.Atoi(end[1])

	return Line{x1: startX, y1: startY, x2: endX, y2: endY}
}

func addToPosition(x int, y int, seaMap map[string]int) map[string]int {
	key := fmt.Sprintf("%d,%d", x, y)
	if _, ok := seaMap[key]; ok {
		seaMap[key] += 1
	} else {
		seaMap[key] = 1
	}
	return seaMap
}

func populateLine(line Line, seaMap map[string]int) map[string]int {
	deltaX := 0 // Vertical lines
	if line.x1 < line.x2 {
		deltaX = 1
	} else if line.x1 > line.x2 {
		deltaX = -1
	}

	deltaY := 0 // Horizontal lines
	if line.y1 < line.y2 {
		deltaY = 1
	} else if line.y1 > line.y2 {
		deltaY = -1
	}

	y := line.y1
	for x := line.x1; x != line.x2 || y != line.y2; x += deltaX {
		seaMap = addToPosition(x, y, seaMap)
		y += deltaY
	}
	// Add the last position of the line
	seaMap = addToPosition(line.x2, y, seaMap)
	return seaMap
}

func populateMap() map[string]int {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	var line Line
	seaMap := make(map[string]int)

	for scanner.Scan() {
		line = getLine(scanner.Text())
		seaMap = populateLine(line, seaMap)
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return seaMap
}

func countOverlapLines(seaMap map[string]int) int {
	count := 0
	for key := range seaMap {
		if seaMap[key] > 1 {
			count++
		}
	}
	return count
}

func main() {
	seaMap := populateMap()
	count := countOverlapLines(seaMap)
	fmt.Printf("Points wirh overlap lines: %d\n", count)
}
