import { GameState, MatchConfig, Position, Snake } from "./types";
import type { Handler } from "aws-lambda";

export const startMatch = (config: MatchConfig): GameState => {
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

import { APIGatewayProxyEvent } from "aws-lambda";

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
	const config = JSON.parse(event?.body || "{}") as MatchConfig;
	const gameState = startMatch(config);
	return {
		statusCode: 200,
		body: JSON.stringify(gameState),
	};
};
