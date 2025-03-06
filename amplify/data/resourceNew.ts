import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	User: a.model({
		userId: a.id().required(),
		displayName: a.string().required(),
		matchReplays: a.hasMany("MatchReplay", "userId"),
	}),
	MatchEventEnum: a.enum(["Up", "Down", "Left", "Right", "Death", "SpawnApple", "MatchEnd", "EatApple", "Disconnect", "Reconnect"]),
	EventCallerEnum: a.enum(["User1", "User2", "Server"]),
	MatchEvent: a.customType({
		eventTime: a.float().required(), // Time since start of the match
		eventType: a.ref("MatchEventType").required(),
		eventCaller: a.ref("EventCallerEnum").required(),
	}),
	MatchReplay: a
		.model({
			startDate: a.datetime().required(),
			matchReplayId: a.id().required(),
			// Foreign keys for the two users involved in the replay
			user1Id: a.id().required(),
			user2Id: a.id().required(),
			// Relations back to the User model
			user1: a.belongsTo("User", "user1Id"),
			user2: a.belongsTo("User", "user1Id"),
			// Replay data
			matchEvents: a.ref("MatchEvent").array(),
		})
		.authorization((allow) => [allow.authenticated().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
	},
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
