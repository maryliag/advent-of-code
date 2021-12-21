package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func getImageInfo() ([]string, [][]string) {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	enhancementAlgorithm := []string{}
	image := [][]string{}

	for scanner.Scan() {
		value := strings.Split(scanner.Text(), "")
		if len(enhancementAlgorithm) == 0 {
			enhancementAlgorithm = value
		} else if len(value) != 0 {
			image = append(image, value)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return enhancementAlgorithm, image
}

// Check if there is any LIT pixel on the 2 outer rows/lines
func needToIncreaseImage(image [][]string) bool {
	for i := 0; i < len(image[0]); i++ {
		if image[0][i] == "#" || image[len(image)-1][i] == "#" ||
			image[1][i] == "#" || image[len(image)-2][i] == "#" {
			return true
		}
	}

	for i := 0; i < len(image); i++ {
		if image[i][0] == "#" || image[i][len(image[0])-1] == "#" ||
			image[i][1] == "#" || image[i][len(image[0])-2] == "#" {
			return true
		}
	}
	return false
}

// Create a border of size two if necessary
func updateImageSize(image [][]string, infiniteLit bool) [][]string {
	if needToIncreaseImage(image) {
		value := "."
		if infiniteLit {
			value = "#"
		}
		increasedImage := [][]string{}
		blankLine := []string{}
		for i := 0; i < len(image[0])+4; i++ {
			blankLine = append(blankLine, value)
		}
		increasedImage = append(increasedImage, blankLine)
		blankLine = []string{}
		for i := 0; i < len(image[0])+4; i++ {
			blankLine = append(blankLine, value)
		}
		increasedImage = append(increasedImage, blankLine)

		for i := 0; i < len(image); i++ {
			line := []string{value, value}
			line = append(line, image[i]...)
			line = append(line, value)
			line = append(line, value)
			increasedImage = append(increasedImage, line)
		}
		blankLine = []string{}
		for i := 0; i < len(image[0])+4; i++ {
			blankLine = append(blankLine, value)
		}
		increasedImage = append(increasedImage, blankLine)
		blankLine = []string{}
		for i := 0; i < len(image[0])+4; i++ {
			blankLine = append(blankLine, value)
		}
		increasedImage = append(increasedImage, blankLine)
		image = increasedImage
	}
	return image
}

func getNewState(enhanceAlg []string, image [][]string, i int, j int, infiniteLit bool) string {
	// Create a pixel area and replace its value if there is a value on the image
	// If the pixel is on the border, the pixel matrix will use the value of the infinite
	pixel := [][]string{}
	value := "."
	if infiniteLit {
		value = "#"
	}
	line := []string{value, value, value}
	pixel = append(pixel, line)
	line = []string{value, value, value}
	pixel = append(pixel, line)
	line = []string{value, value, value}
	pixel = append(pixel, line)
	xMax := len(image[0])
	yMax := len(image)

	for x := -1; x <= 1; x++ {
		for y := -1; y <= 1; y++ {
			if (j+y) >= 0 && (j+y) < (yMax-1) && (i+x) >= 0 && (i+x) < (xMax-1) {
				pixel[y+1][x+1] = image[j+y][i+x]
			}
		}
	}
	numberBinary := []string{}
	for y := 0; y < 3; y++ {
		for x := 0; x < 3; x++ {
			number := "0"
			// If the value is # (current LIT) or DARK (it was LIT and
			// will be turned to DARK so it should be consider still LIT)
			if pixel[y][x] == "#" || pixel[y][x] == "DARK" {
				number = "1"
			}
			numberBinary = append(numberBinary, number)
		}
	}
	position, _ := strconv.ParseInt(strings.Join(numberBinary, ""), 2, 64)

	// If should be # but is currently ., update to LIT on this interaction
	if enhanceAlg[position] == "#" && image[j][i] == "." {
		return "LIT"
	}
	// If should be . but is currently #, update to DARK on this interaction
	if enhanceAlg[position] == "." && image[j][i] == "#" {
		return "DARK"
	}
	// If there is no change, keep the value as is
	return image[j][i]
}

func enhanceImage(enhanceAlg []string, image [][]string, infiniteLit bool) ([][]string, bool) {
	image = updateImageSize(image, infiniteLit)
	// Calculate all the new state for each pixel
	for y := 0; y < len(image); y++ {
		for x := 0; x < len(image[0]); x++ {
			image[y][x] = getNewState(enhanceAlg, image, x, y, infiniteLit)
		}
	}
	// Replace the temporary name of the state for the real value
	for i := 0; i < len(image); i++ {
		for j := 0; j < len(image[0]); j++ {
			if image[i][j] == "DARK" {
				image[i][j] = "."
			}
			if image[i][j] == "LIT" {
				image[i][j] = "#"
			}
		}
	}

	if infiniteLit && enhanceAlg[511] == "." {
		infiniteLit = false
	} else if !infiniteLit && enhanceAlg[0] == "#" {
		infiniteLit = true
	}

	return image, infiniteLit
}

func getLitCount(image [][]string) int {
	count := 0
	for i := 0; i < len(image); i++ {
		for j := 0; j < len(image[0]); j++ {
			if image[i][j] == "#" {
				count++
			}
		}
	}
	return count
}

func main() {
	enhanceAlg, image := getImageInfo()
	infiniteLit := false

	for i := 0; i < 2; i++ {
		image, infiniteLit = enhanceImage(enhanceAlg, image, infiniteLit)
	}
	fmt.Printf("Total lit pixels Part 1: %d\n", getLitCount(image))

	for i := 2; i < 50; i++ {
		image, infiniteLit = enhanceImage(enhanceAlg, image, infiniteLit)
	}
	fmt.Printf("Total lit pixels Part 2: %d\n", getLitCount(image))
}
