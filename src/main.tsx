import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Box } from "@mui/material";
import SocialPage from "./pages/SocialPage.tsx";
import BottomNav from "./components/BottomNav.comp.tsx";
import "./index.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";

import "@aws-amplify/ui-react/styles.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Authenticator>
			<CssBaseline />
			<BrowserRouter>
				<Box sx={{ flexGrow: 1, height: "100%", padding: 2, display: "flex", flexDirection: "column", gap: 1 }}>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/social" element={<SocialPage />} />
					</Routes>
				</Box>
				<BottomNav />
			</BrowserRouter>
		</Authenticator>
	</React.StrictMode>
);
