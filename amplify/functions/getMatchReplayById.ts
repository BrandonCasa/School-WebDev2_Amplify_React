// amplify/functions/get-match-replay-by-id/handler.ts

import type { Schema } from "../../amplify/data/resource";
import { DynamoDB } from "aws-sdk";
import { env } from "$amplify/env/get-match-replay-by-id"; // typed access to your env vars :contentReference[oaicite:0]{index=0}

const docClient = new DynamoDB.DocumentClient();

/**
 * Strongly-typed Gen 2 AppSync function handler.
 */
export const handler: Schema["getMatchReplayById"]["functionHandler"] = async (event) => {
	const { matchReplayId } = event.arguments;
	if (!matchReplayId) {
		throw new Error("getMatchReplayById requires a `matchReplayId` argument");
	}

	// DynamoDB key lookup
	const result = await docClient
		.get({
			TableName: env.MATCHREPLAY_TABLE_NAME, // comes from your function’s environment :contentReference[oaicite:1]{index=1}
			Key: { matchReplayId },
		})
		.promise();

	if (!result.Item) {
		throw new Error(`MatchReplay with id '${matchReplayId}' not found`);
	}

	// AppSync will coerce this back into your GraphQL type
	return result.Item as Schema["MatchReplay"]["type"];
};
