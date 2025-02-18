import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

function SocialPage() {
	// const { user, signOut } = useAuthenticator();

	useEffect(() => {}, []);

	return (
		<Box sx={{ flexGrow: 1, padding: 0, display: "flex", flexDirection: "column", gap: 1 }}>
			<Paper elevation={1} sx={{ textAlign: "center" }}>
				<Typography variant="h6">Social Hub</Typography>
			</Paper>
			<Paper elevation={1} sx={{ textAlign: "center", flexGrow: 1 }}>
				<Typography variant="h6">Social Hub</Typography>
			</Paper>
		</Box>
	);
}

export default SocialPage;
