import { defineFunction } from "@aws-amplify/backend";

export const createInitialGameState = defineFunction({
	name: "create-initial-game-state",
	entry: "./createInitialGameState.ts",
});
