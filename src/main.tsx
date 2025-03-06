import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Box } from "@mui/material";
import SocialPage from "./pages/SocialPage.tsx";
import BottomNav from "./components/BottomNav.comp.tsx";
import "./index.css";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";

import "@aws-amplify/ui-react/styles.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resourceNew.ts";

Amplify.configure(outputs);

function InnerMain(props: { children: any }) {
	const client = generateClient<Schema>();
	//const [userObj, setUserObj] = useState<Array<Schema["User"]["type"]>>();
	const { user, signOut } = useAuthenticator();

	return (
		<>
			{<h1>{JSON.stringify(user)}'s todos</h1>}
			{props.children}
		</>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Authenticator>
			<CssBaseline />
			<BrowserRouter>
				<Box sx={{ flexGrow: 1, height: "100%", padding: 2, display: "flex", flexDirection: "column", gap: 1 }}>
					<InnerMain>
						<Routes>
							<Route path="/" element={<App />} />
							<Route path="/social" element={<SocialPage />} />
						</Routes>
					</InnerMain>
				</Box>
				<BottomNav />
			</BrowserRouter>
		</Authenticator>
	</React.StrictMode>
);
