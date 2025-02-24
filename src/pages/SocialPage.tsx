import { useEffect, useState, Fragment } from "react";
import { Box, Button, Paper, Typography, List, ListItem, ListItemAvatar, Avatar, Divider, ListItemText } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

function UserCard(props: { displayName: string; rank: string; status: string; picture: string }) {
	return (
		<ListItem alignItems="flex-start">
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
	const [friendsList, setFriendsList] = useState([]);
	// const { user, signOut } = useAuthenticator();

	useEffect(() => {}, []);

	return (
		<Box sx={{ flexGrow: 1, padding: 0, display: "flex", flexDirection: "column", gap: 1 }}>
			<Paper elevation={1} sx={{ textAlign: "center" }}>
				<Typography variant="h6">Social Hub</Typography>
			</Paper>
			<Paper elevation={1} sx={{ flexGrow: 1 }}>
				<List sx={{ width: "100%", bgcolor: "background.paper" }}>
					<UserCard displayName="Tyler Ninja Blevins" rank="Grandmaster 2" status="Offline" picture="" />
					<Divider variant="inset" component="li" />
					<UserCard displayName="Alex Swift" rank="Gold 3" status="Ranked Play (0 : 3)" picture="" />
				</List>
			</Paper>
		</Box>
	);
}

export default SocialPage;
