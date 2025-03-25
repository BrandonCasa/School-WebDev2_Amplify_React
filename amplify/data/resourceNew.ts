import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	User: a.model({
		userId: a.id().required(),
		displayName: a.string().required(),
		matchReplays: a.hasMany("MatchReplay", "user1Id"),
	}),
	MatchEventEnum: a.enum([
		"Up",
		"Down",
		"Left",
		"Right",
		"WallCollision",
		"SelfCollision",
		"PlayerCollision",
		"MatchPause",
		"MatchUnpause",
		"SpawnApple",
		"MatchEndEarly",
		"MatchEnd",
		"ScoreUp",
		"LengthIncrease",
		"SpawnPlayer",
		"KillPlayer",
		"MatchStart",
		"Disconnect",
		"Reconnect",
		"PlayerJoin",
	]),
	EventEntityEnum: a.enum(["User1", "User2", "Server"]),
	Position: a.customType({
		x: a.integer().required(),
		y: a.integer().required(),
	}),
	MatchEvent: a.customType({
		eventTimeMS: a.float().required(),
		eventType: a.ref("MatchEventEnum").required(),
		eventCaller: a.ref("EventEntityEnum").required(),
		eventTarget: a.ref("EventEntityEnum"),
		position: a.ref("Position"),
		miscData: a.json(), // such as index of the apple being eaten
	}),
	MatchConfig: a.customType({
		boardWidth: a.integer().required(),
		boardHeight: a.integer().required(),
		initialSnakeSpeed: a.float().required(),
	}),
	MatchReplay: a
		.model({
			startDate: a.datetime().required(),
			matchReplayId: a.id().required(),
			user1Id: a.id().required(),
			user2Id: a.id().required(),
			winnerUserId: a.id(),
			user1: a.belongsTo("User", "user1Id"),
			user2: a.belongsTo("User", "user2Id"),
			winner: a.belongsTo("User", "winnerUserId"),
			config: a.ref("MatchConfig").required(),
			matchEvents: a.ref("MatchEvent").array(),
		})
		.authorization((allow) => [allow.authenticated().to(["read", "create", "update", "delete"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
	},
});

export interface Position {
	x: number;
	y: number;
}

export interface Snake {
	segmentLocationHistory: Position[];
	length: number;
	score: number;
	movementDirection: "Up" | "Down" | "Left" | "Right";
	alive: boolean;
}

export interface GameState {
	board: number[][];
	snake1: Snake;
	snake2: Snake;
	apples: Position[];
	paused: boolean;
}

export interface MatchConfig {
	boardWidth: number;
	boardHeight: number;
	initialSnakeSpeed: number;
}

/**
 * Creates an initial game state based on the provided match configuration.
 * @param config The match configuration settings.
 * @returns The initial game state.
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

/**
 * Moves a snake in its current direction by updating its segment location history.
 * @param snake The snake to move.
 * @returns The updated snake.
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

/**
 * Generates a new apple position on the board that does not collide with any snake segments.
 * @param gameState The current game state.
 * @returns The new apple position.
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

/**
 * Checks if a given position is occupied by any segment of either snake.
 * @param position The position to check.
 * @param gameState The current game state.
 * @returns True if the position is occupied; otherwise, false.
 */
const isPositionOccupied = (position: Position, gameState: GameState): boolean => {
	const snake1Occupies = gameState.snake1.segmentLocationHistory.some((segment) => segment.x === position.x && segment.y === position.y);
	const snake2Occupies = gameState.snake2.segmentLocationHistory.some((segment) => segment.x === position.x && segment.y === position.y);
	return snake1Occupies || snake2Occupies;
};
