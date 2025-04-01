import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { createInitialGameState } from "./functions/functions";

defineBackend({
	auth,
	data,
	createInitialGameState,
});
