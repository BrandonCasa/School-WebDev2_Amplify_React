import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography, IconButton, ButtonProps, CSSObject, IconButtonProps } from "@mui/material";
import AppIcon from "@mui/icons-material/Apps";
import StyledIconButton from "./StyledIconButton.comp";

function BottomNav() {
	useEffect(() => {}, []);

	return (
		<Box sx={{ height: "4rem", paddingLeft: 2, paddingRight: 2, paddingBottom: "0.5rem", display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
			<StyledIconButton sx={{ width: "2.625rem", height: "2.625rem", borderRadius: "0.75rem" }}>
				<AppIcon />
			</StyledIconButton>
			<StyledIconButton sx={{ width: "3.5rem", height: "3.5rem", borderRadius: "1rem" }}>
				<AppIcon />
			</StyledIconButton>
			<StyledIconButton sx={{ width: "2.625rem", height: "2.625rem", borderRadius: "0.75rem" }}>
				<AppIcon />
			</StyledIconButton>
		</Box>
	);
}

export default BottomNav;
