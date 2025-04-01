import { GameState, MatchConfig, Position, Snake } from "./types";
import type { Handler } from "aws-lambda";

/**
 * Creates an initial game state based on the provided match configuration.
 */
export const createInitialGameState = (config: MatchConfig): GameState => {
	const { boardWidth, boardHeight } = config;
	const board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

	const snake1: Snake = {
		segmentLocationHistory: [{ x: Math.floor(boardWidth / 4), y: Math.floor(boardHeight / 2) }],
		length: 1,
		score: 0,
		movementDirection: "Right",
		alive: true,
	};

	const snake2: Snake = {
		segmentLocationHistory: [{ x: Math.floor((3 * boardWidth) / 4), y: Math.floor(boardHeight / 2) }],
		length: 1,
		score: 0,
		movementDirection: "Left",
		alive: true,
	};

	const apple: Position = { x: Math.floor(boardWidth / 2), y: Math.floor(boardHeight / 2) };

	return { board, snake1, snake2, apples: [apple], paused: true };
};

// If needed, export a Lambda handler for Gen2:
export const handler: Handler = async (event: any) => {
	const config = JSON.parse(event.body);
	const gameState = createInitialGameState(config);
	return {
		statusCode: 200,
		body: JSON.stringify(gameState),
	};
};
