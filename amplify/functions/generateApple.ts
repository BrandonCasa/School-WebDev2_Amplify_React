import { GameState, Position } from "./types";
import type { Handler } from "aws-lambda";

/**
 * Checks if a given position is occupied by any segment of either snake.
 */
const isPositionOccupied = (position: Position, gameState: GameState): boolean => {
	const snake1Occupies = gameState.snake1.segmentLocationHistory.some((segment) => segment.x === position.x && segment.y === position.y);
	const snake2Occupies = gameState.snake2.segmentLocationHistory.some((segment) => segment.x === position.x && segment.y === position.y);
	return snake1Occupies || snake2Occupies;
};

/**
 * Generates a new apple position on the board that does not collide with any snake segments.
 */
export const generateApple = (gameState: GameState): Position => {
	const boardHeight = gameState.board.length;
	const boardWidth = gameState.board[0].length;
	let newApple: Position;
	do {
		newApple = {
			x: Math.floor(Math.random() * boardWidth),
			y: Math.floor(Math.random() * boardHeight),
		};
	} while (isPositionOccupied(newApple, gameState));
	return newApple;
};

// Lambda handler for Gen2:
export const handler: Handler = async (event: any) => {
	const gameState = JSON.parse(event.body);
	const newApple = generateApple(gameState);
	return {
		statusCode: 200,
		body: JSON.stringify(newApple),
	};
};
