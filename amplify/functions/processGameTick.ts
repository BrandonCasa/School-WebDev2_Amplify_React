import { DynamoDB } from "aws-sdk";
import { GameState, MatchReplay, MatchEvent, Position, Snake } from "./types";

const db = new DynamoDB.DocumentClient();
const TABLE = process.env.MATCH_REPLAY_TABLE!;

async function loadReplay(id: string): Promise<MatchReplay> {
	const res = await db.get({ TableName: TABLE, Key: { matchReplayId: id } }).promise();
	return res.Item as MatchReplay;
}

function moveSnake(snake: Snake): Snake {
	/* reuse your moveSnake logic */
}

function isCollision(pos: Position, state: GameState): "None" | "Wall" | "Self" | "Other" {
	if (pos.x < 0 || pos.y < 0 || pos.x >= state.board[0].length || pos.y >= state.board.length) {
		return "Wall";
	}
	if (state.snake1.segmentLocationHistory.some((s) => s.x === pos.x && s.y === pos.y) || state.snake2.segmentLocationHistory.some((s) => s.x === pos.x && s.y === pos.y)) {
		// if hitting own head -> Self, if hitting other head or body -> Other
		// implement distinction
		return "Other";
	}
	return "None";
}

function applyTick(state: GameState): { state: GameState; events: MatchEvent[] } {
	const events: MatchEvent[] = [];
	// advance each snake
	const snakes = [state.snake1, state.snake2].map(moveSnake);
	// test collisions & mark alive=false if needed
	snakes.forEach((snake, idx) => {
		const col = isCollision(snake.segmentLocationHistory[0], state);
		if (col !== "None") {
			snake.alive = false;
			events.push({
				eventTimeMS: Date.now(),
				eventType: col === "Wall" ? "WallCollision" : "PlayerCollision",
				eventCaller: idx === 0 ? "User1" : "User2",
			} as MatchEvent);
		}
	});

	// apple eat?
	const newApples = [...state.apples];
	snakes.forEach((snake, idx) => {
		const head = snake.segmentLocationHistory[0];
		state.apples.forEach((apple, ai) => {
			if (apple.x === head.x && apple.y === head.y && snake.alive) {
				snake.score++;
				snake.length++;
				events.push({
					eventTimeMS: Date.now(),
					eventType: "ScoreUp",
					eventCaller: idx === 0 ? "User1" : "User2",
					miscData: { newScore: snake.score },
				} as MatchEvent);
				// spawn new apple
				newApples[ai] = generateApple({ ...state, snake1: snakes[0], snake2: snakes[1], apples: newApples });
				events.push({
					eventTimeMS: Date.now(),
					eventType: "SpawnApple",
					eventCaller: "Server",
					position: newApples[ai],
					miscData: { appleIndex: ai },
				} as MatchEvent);
			}
		});
	});

	return {
		state: { ...state, snake1: snakes[0], snake2: snakes[1], apples: newApples },
		events,
	};
}

export const handler = async (evt: any) => {
	const { matchReplayId } = JSON.parse(evt.body);
	const replay = await loadReplay(matchReplayId);
	const { state, events } = applyTick(replay);
	// append events & new state to DynamoDB
	await db
		.update({
			TableName: TABLE,
			Key: { matchReplayId },
			UpdateExpression: "SET gameState = :s, matchEvents = list_append(matchEvents, :e)",
			ExpressionAttributeValues: {
				":s": state,
				":e": events,
			},
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({ state, events }),
	};
};
