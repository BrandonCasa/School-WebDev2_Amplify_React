// functions/functions.ts
import { defineFunction } from "@aws-amplify/backend";

export const createInitialGameStateFunc = defineFunction({
	name: "create-initial-game-state",
	entry: "./createInitialGameState.ts",
});

export const processGameTick = defineFunction({
	name: "process-game-tick",
	entry: "./processGameTick.ts",
});

export const getMatchReplayByIdFunc = defineFunction({
	name: "get-match-replay-by-id",
	entry: "./getMatchReplayById.ts",
});
