import { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource.ts";
// Note: the subscription below assumes your backend still publishes updates via DataStore or AppSync.
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function StartMatchPage() {
	const { user, signOut } = useAuthenticator();
	const [matchReplay, setMatchReplay] = useState<Schema["MatchReplay"]["type"] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calls the backend endpoint to start the match.
	async function startMatch() {
		setLoading(true);
		setError(null);
		try {
			// Replace 'startMatchApi' with your API name and ensure that the endpoint '/start-match'
			// is connected to a Lambda (or AppSync resolver) that creates the match replay on the backend.
			const response = await API.post("startMatchApi", "/start-match", {
				body: {
					// Pass any required parameters – here we pass the caller’s userId.
					userId: user?.signInDetails?.loginId || "unknown",
					// You can add an opponentId or other config parameters as needed.
				},
			});
			// The backend returns the new MatchReplay record.
			setMatchReplay(response);
		} catch (err: any) {
			console.error("Error starting match", err);
			setError("Error starting match");
		} finally {
			setLoading(false);
		}
	}

	// Subscribe to updates for this match replay.
	useEffect(() => {
		let subscription: any;
		if (matchReplay) {
			subscription = client.models.MatchReplay.subscribe(matchReplay.matchReplayId).subscribe({
				next: (update) => {
					console.log("Received match replay update", update);
					setMatchReplay(update);
				},
				error: (err) => {
					console.error("Subscription error", err);
				},
			});
		}
		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [matchReplay]);

	// Optionally, a function to trigger an event (this, too, could be moved to the backend).
	async function sendTestEvent() {
		if (!matchReplay) return;
		try {
			const response = await API.post("startMatchApi", "/send-event", {
				body: {
					matchReplayId: matchReplay.matchReplayId,
					event: {
						eventTimeMS: Date.now(),
						eventType: "ScoreUp",
						eventCaller: "Server",
					},
				},
			});
			setMatchReplay(response);
		} catch (err: any) {
			console.error("Error sending test event", err);
			setError("Error sending test event");
		}
	}

	return (
		<Container maxWidth="sm">
			<Card sx={{ mt: 8 }}>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						Start a New Match
					</Typography>
					<Typography variant="body1">Logged in as: {user?.signInDetails?.loginId || "Unknown"}</Typography>
					<Button variant="contained" onClick={startMatch} disabled={loading} sx={{ mt: 2 }}>
						{loading ? "Starting Match..." : "Start Match"}
					</Button>
					{matchReplay && (
						<div style={{ marginTop: "20px" }}>
							<Typography variant="h6">Match Started!</Typography>
							<Typography variant="body2">Match ID: {matchReplay.matchReplayId}</Typography>
							<Typography variant="body2">Start Date: {matchReplay.startDate}</Typography>
							<Typography variant="body2">
								Board: {matchReplay.config.boardWidth} x {matchReplay.config.boardHeight} | Initial Speed: {matchReplay.config.initialSnakeSpeed}
							</Typography>
							<Button variant="outlined" onClick={sendTestEvent} sx={{ mt: 2 }}>
								Send Test Event
							</Button>
							<div style={{ marginTop: "10px" }}>
								<Typography variant="subtitle1">Match Events:</Typography>
								{matchReplay.matchEvents.map((event, index) => (
									<Typography key={index} variant="body2">
										[{new Date(event.eventTimeMS).toLocaleTimeString()}] {event.eventType} by {event.eventCaller}
									</Typography>
								))}
							</div>
						</div>
					)}
					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}
					<Button onClick={signOut} sx={{ mt: 2 }}>
						Sign Out
					</Button>
				</CardContent>
			</Card>
		</Container>
	);
}

export default StartMatchPage;
