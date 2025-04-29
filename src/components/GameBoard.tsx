import { useState, useEffect, useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { recordEvent, tickGame } from "../graphql/mutations";
import { onUpdateMatch } from "../graphql/subscriptions";
import type { GameState } from "../amplify/data/resource";

export default function GameBoard({ matchId, initialSpeed }: { matchId: string; initialSpeed: number }) {
	const [state, setState] = useState<GameState | null>(null);

	// subscribe
	useEffect(() => {
		const sub = (API.graphql(graphqlOperation(onUpdateMatch, { matchReplayId: matchId })) as any).subscribe({ next: ({ value }) => setState(value.data.onUpdateMatch) });
		return () => sub.unsubscribe();
	}, [matchId]);

	// game loop
	useEffect(() => {
		if (!state) return;
		const interval = setInterval(() => {
			API.graphql(graphqlOperation(tickGame, { matchReplayId: matchId }));
		}, 1000 / initialSpeed);
		return () => clearInterval(interval);
	}, [state, initialSpeed]);

	// input handler
	const handleKey = useCallback(
		(e: KeyboardEvent) => {
			const map: Record<string, string> = { ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right" };
			const dir = map[e.key];
			if (!dir) return;
			API.graphql(
				graphqlOperation(recordEvent, {
					matchReplayId: matchId,
					event: { eventTimeMS: Date.now(), eventType: dir, eventCaller: "User1" },
				})
			);
		},
		[matchId]
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [handleKey]);

	if (!state) return <div>Loading…</div>;

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${state.board[0].length}, 20px)`,
				gridTemplateRows: `repeat(${state.board.length}, 20px)`,
			}}
		>
			{state.board.flatMap((row, y) =>
				row.map((_, x) => {
					let bg = "#fff";
					if (state.apples.some((a) => a.x === x && a.y === y)) bg = "red";
					if (state.snake1.segmentLocationHistory.some((s) => s.x === x && s.y === y)) bg = "green";
					if (state.snake2.segmentLocationHistory.some((s) => s.x === x && s.y === y)) bg = "blue";
					return (
						<div
							key={`${x}-${y}`}
							style={{
								width: 20,
								height: 20,
								border: "1px solid #ddd",
								background: bg,
							}}
						/>
					);
				})
			)}
		</div>
	);
}
