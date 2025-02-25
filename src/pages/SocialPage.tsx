import { useEffect, useState, Fragment } from "react";
import { Box, Button, Paper, Typography, List, Divider, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

function UserCard(props: { displayName: string; rank: string; status: string; picture: string }) {
	return (
		<ListItem alignItems="flex-start">
			{/* User avatar */}
			<ListItemAvatar>
				<Avatar src={props.picture} alt={props.displayName || "Error"} />
			</ListItemAvatar>
			<ListItemText
				primary={props.displayName || "Error"}
				secondary={
					<Fragment>
						<Typography component="span" variant="body2" sx={{ color: "text.primary", display: "inline" }}>
							{props.rank || "Unranked"}
						</Typography>
						{" — " + (props.status || "Unknown")}
					</Fragment>
				}
			/>
		</ListItem>
	);
}

function SocialPage() {
	const [friendsList, setFriendsList] = useState([
		{
			displayName: "Tyler Ninja Blevins",
			rank: "Grandmaster 2",
			status: "Offline",
			picture: "",
		},
		{
			displayName: "Alex Swift",
			rank: "Gold 3",
			status: "Ranked Play (0 : 3)",
			picture: "",
		},
	]);
	const addFakeFriend = () => {
		const fakeFriend = {
			displayName: `Fake Friend ${friendsList.length + 1}`,
			rank: "Unranked",
			status: "Online",
			picture: "",
		};
		setFriendsList((prev) => [...prev, fakeFriend]);
	};

	useEffect(() => {}, []);

	return (
		<Box sx={{ flexGrow: 1, padding: 2, display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
			<Paper elevation={1} sx={{ textAlign: "center", padding: 1 }}>
				<Typography variant="h6">Social Hub</Typography>
			</Paper>
			<Button variant="contained" onClick={addFakeFriend}>
				Add Fake Friend
			</Button>
			<Paper elevation={1} sx={{ flexGrow: 1, overflowY: "auto" }}>
				<List sx={{ width: "100%", bgcolor: "background.paper" }}>
					{friendsList.map((friend, index) => (
						<Fragment key={index}>
							<UserCard displayName={friend.displayName} rank={friend.rank} status={friend.status} picture={friend.picture} />
							{index !== friendsList.length - 1 && <Divider variant="inset" component="li" />}
						</Fragment>
					))}
				</List>
			</Paper>
		</Box>
	);
}

export default SocialPage;
