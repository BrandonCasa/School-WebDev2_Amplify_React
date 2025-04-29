import { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import GameBoard from "../components/GameBoard";

const client = generateClient<Schema>();

export default function StartMatchPage() {
	const { user, signOut } = useAuthenticator();
	const [matchReplay, setMatchReplay] = useState<Schema["MatchReplay"]["type"] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calls the REST endpoint (or AppSync) to start the match.
	async function startMatch() {
		setLoading(true);
		setError(null);
		try {
			const response = await API.post("startMatchApi", "/start-match", {
				body: {
					userId: user?.username || "unknown",
					// you can pass opponentId or custom config here
				},
			});
			setMatchReplay(response as Schema["MatchReplay"]["type"]);
		} catch (err: any) {
			console.error("Error starting match", err);
			setError("Error starting match");
		} finally {
			setLoading(false);
		}
	}

	// Subscribe to live updates for this match via DataStore/AppSync.
	useEffect(() => {
		let subscription: { unsubscribe: () => void } | undefined;
		if (matchReplay) {
			subscription = client.models.MatchReplay.subscribe(matchReplay.matchReplayId).subscribe({
				next: ({ value }) => {
					setMatchReplay(value as Schema["MatchReplay"]["type"]);
				},
				error: (err) => {
					console.error("Subscription error", err);
				},
			});
		}
		return () => subscription?.unsubscribe();
	}, [matchReplay]);

	// Example: trigger a server-side test event (e.g. ScoreUp)
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
			setMatchReplay(response as Schema["MatchReplay"]["type"]);
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
					<Typography variant="body1">Logged in as: {user?.username || "Unknown"}</Typography>

					<Button variant="contained" onClick={startMatch} disabled={loading || !!matchReplay} sx={{ mt: 2 }}>
						{loading ? "Starting Match…" : matchReplay ? "Match Started" : "Start Match"}
					</Button>

					{matchReplay && (
						<>
							<Typography variant="subtitle1" sx={{ mt: 3 }}>
								Match ID: {matchReplay.matchReplayId}
							</Typography>
							<GameBoard matchId={matchReplay.matchReplayId} initialSpeed={matchReplay.config.initialSnakeSpeed} />
							<Button variant="outlined" onClick={sendTestEvent} sx={{ mt: 2 }}>
								Send Test Event
							</Button>
						</>
					)}

					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}

					<Button onClick={signOut} sx={{ mt: 4 }}>
						Sign Out
					</Button>
				</CardContent>
			</Card>
		</Container>
	);
}
