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

// From the key string return p1Position, p2Position, p1Points, p2Points
func getGameInfo(game string) (int, int, int, int) {
	info := strings.Split(game, ",")
	p1Position, _ := strconv.Atoi(info[0])
	p2Position, _ := strconv.Atoi(info[1])
	p1Points, _ := strconv.Atoi(info[2])
	p2Points, _ := strconv.Atoi(info[3])

	return p1Position, p2Position, p1Points, p2Points
}

// Move Player in all existing game states
func movePlayer(player int, games map[string]int, wins []int, possibleAdditions []int) (map[string]int, []int) {
	newGames := map[string]int{}

	for key, value := range games {
		p1Position, p2Position, p1Points, p2Points := getGameInfo(key)
		pPosition := p1Position
		pPoints := p1Points
		if player == 2 {
			pPosition = p2Position
			pPoints = p2Points
		}

		// Create a new game for each possible additions to
		// the current game. If the points each 21 the game stops.
		for i := 0; i < len(possibleAdditions); i++ {
			newPosition := (pPosition + possibleAdditions[i]) % 10
			if newPosition == 0 {
				newPosition = 10
			}
			newPoints := pPoints + newPosition
			if newPoints >= 21 {
				wins[player-1] += value
			} else {
				if player == 1 {
					p1Position = newPosition
					p1Points = newPoints
				} else {
					p2Position = newPosition
					p2Points = newPoints
				}
				newKey := fmt.Sprintf("%d,%d,%d,%d", p1Position, p2Position, p1Points, p2Points)
				// The count of the existing game is added to the count of the
				// new game generate count.
				newGames[newKey] += value
			}
		}
	}

	return newGames, wins
}

func main() {
	p1, p2 := getInitialPositions()
	wins := []int{0, 0}
	possibleAdditions := []int{}
	for i := 1; i < 4; i++ {
		for j := 1; j < 4; j++ {
			for k := 1; k < 4; k++ {
				possibleAdditions = append(possibleAdditions, i+j+k)
			}
		}
	}

	turn := 1
	key := fmt.Sprintf("%d,%d,0,0", p1, p2)
	// Map that has a key as the state of the game and the value
	// the number of exiting games with that same state.
	games := map[string]int{key: 1}

	for len(games) > 0 {
		games, wins = movePlayer(turn, games, wins, possibleAdditions)
		if turn == 1 {
			turn = 2
		} else {
			turn = 1
		}
	}

	fmt.Printf("P1 Wins: %d \nP2 Wins: %d\n", wins[0], wins[1])
}
