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
