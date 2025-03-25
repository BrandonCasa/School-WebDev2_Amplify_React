import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";

function App() {
	const { user, signOut } = useAuthenticator();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Card>
				<CardContent>
					<Typography variant="h4" component="h1" gutterBottom>
						Welcome, {user?.signInDetails?.loginId || "User"}
					</Typography>
					<Typography variant="body1">This is your landing page. Enjoy exploring your application!</Typography>
					<Button variant="contained" color="primary" onClick={signOut} sx={{ mt: 2 }}>
						Sign Out
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
}

export default App;
