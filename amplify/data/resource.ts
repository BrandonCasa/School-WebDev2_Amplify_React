import { type ClientSchema, a, defineData, defineAuth } from "@aws-amplify/backend";
import { handler as createInitialGameStateHandler } from "../functions/createInitialGameState";

const schema = a.schema({
	User: a
		.model({
			userId: a.id().required(),
			displayName: a.string().required(),
			matchReplaysAsUser1: a.hasMany("MatchReplay", "user1Id"),
			matchReplaysAsUser2: a.hasMany("MatchReplay", "user2Id"),
			matchReplaysAsWinner: a.hasMany("MatchReplay", "winnerUserId"),
		})
		.authorization((allow) => [allow.owner().to(["read", "update", "delete"])]),
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
	createInitialGameState: a
		.query()
		.arguments({
			config: a.json(),
		})
		.returns(a.json())
		.authorization((allow) => [allow.guest()])
		.handler(a.handler.function(createInitialGameStateHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
	},
});
