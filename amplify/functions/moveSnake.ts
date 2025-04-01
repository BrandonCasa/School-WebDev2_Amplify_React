import { Snake, Position } from "./types";
import type { Handler } from "aws-lambda";

/**
 * Moves a snake in its current direction by updating its segment location history.
 */
export const moveSnake = (snake: Snake): Snake => {
	const head = snake.segmentLocationHistory[0];
	let newHead: Position;

	switch (snake.movementDirection) {
		case "Up":
			newHead = { x: head.x, y: head.y - 1 };
			break;
		case "Down":
			newHead = { x: head.x, y: head.y + 1 };
			break;
		case "Left":
			newHead = { x: head.x - 1, y: head.y };
			break;
		case "Right":
			newHead = { x: head.x + 1, y: head.y };
			break;
		default:
			newHead = { ...head };
			break;
	}

	const newHistory = [newHead, ...snake.segmentLocationHistory];
	if (newHistory.length > snake.length) {
		newHistory.pop();
	}

	return { ...snake, segmentLocationHistory: newHistory };
};

// Lambda handler for Gen2:
export const handler: Handler = async (event: any) => {
	const snake = JSON.parse(event.body);
	const updatedSnake = moveSnake(snake);
	return {
		statusCode: 200,
		body: JSON.stringify(updatedSnake),
	};
};
