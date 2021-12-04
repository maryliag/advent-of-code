package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type BoardItem struct {
	number int
	called bool
}

type Input struct {
	calledNumbers []int
	boards        [][][]BoardItem
}

func getInput() Input {
	f, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	var calledNumbers []int
	var boards [][][]BoardItem
	var board [][]BoardItem

	for scanner.Scan() {
		value := scanner.Text()
		if calledNumbers == nil {
			calledNumbersString := strings.Split(value, ",")
			for i := 0; i < len(calledNumbersString); i++ {
				number, _ := strconv.Atoi(calledNumbersString[i])
				calledNumbers = append(calledNumbers, number)
			}

		} else if value == "" {
			if board != nil {
				boards = append(boards, board)
			}
			board = [][]BoardItem{}
		} else {
			numbers := strings.Fields(value)
			items := []BoardItem{}
			for i := 0; i < len(numbers); i++ {
				number, _ := strconv.Atoi(numbers[i])
				item := BoardItem{number: number, called: false}
				items = append(items, item)
			}
			board = append(board, items)
		}
	}
	boards = append(boards, board)
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	return Input{calledNumbers: calledNumbers, boards: boards}
}

func setCalledNumber(number int, board [][]BoardItem) [][]BoardItem {
	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[i]); j++ {
			if board[i][j].number == number {
				board[i][j].called = true
			}
		}
	}
	return board
}

func isBingo(board [][]BoardItem) bool {
	// Check Horizontal
	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[i]); j++ {
			if !board[i][j].called {
				break
			} else if j == (len(board[i]) - 1) {
				return true
			}
		}
	}

	// Check Vertical
	for j := 0; j < len(board[0]); j++ {
		for i := 0; i < len(board); i++ {
			if !board[i][j].called {
				break
			} else if i == (len(board) - 1) {
				return true
			}
		}
	}

	return false
}

func getSumUnmarkedNumbers(board [][]BoardItem) int {
	sum := 0
	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[i]); j++ {
			if !board[i][j].called {
				sum += board[i][j].number
			}
		}
	}
	return sum
}

func main() {
	input := getInput()
	bingoNumber := -1
	sumUnmarkedNumbers := 0
	for i := 0; i < len(input.calledNumbers) && bingoNumber == -1; i++ {
		for j := 0; j < len(input.boards) && bingoNumber == -1; j++ {
			input.boards[j] = setCalledNumber(input.calledNumbers[i], input.boards[j])
			if isBingo(input.boards[j]) {
				bingoNumber = input.calledNumbers[i]
				sumUnmarkedNumbers = getSumUnmarkedNumbers(input.boards[j])
			}
		}
	}

	fmt.Printf("Sum of all Unmarked Numbers: %d \nLast called number: %d\nMultiplication: %d\n", sumUnmarkedNumbers, bingoNumber, sumUnmarkedNumbers*bingoNumber)
}
