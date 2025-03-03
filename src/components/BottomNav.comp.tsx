import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography, IconButton, ButtonProps, CSSObject, IconButtonProps } from "@mui/material";
import AppIcon from "@mui/icons-material/Apps";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/HomeRounded";
import StyledIconButton from "./StyledIconButton.comp";
import { useNavigate } from "react-router";

function BottomNav() {
	let navigate = useNavigate();

	useEffect(() => {}, []);

	return (
		<Box sx={{ height: "4rem", paddingLeft: 2, paddingRight: 2, paddingBottom: "0.5rem", display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
			<StyledIconButton
				sx={{ width: "2.625rem", height: "2.625rem", borderRadius: "0.75rem" }}
				onClick={() => {
					navigate("/");
				}}
			>
				<AppIcon />
			</StyledIconButton>
			<StyledIconButton
				sx={{ width: "3.5rem", height: "3.5rem", borderRadius: "1rem" }}
				onClick={() => {
					navigate("/");
				}}
			>
				<HomeIcon sx={{ fontSize: "1.75em" }} />
			</StyledIconButton>
			<StyledIconButton
				sx={{ width: "2.625rem", height: "2.625rem", borderRadius: "0.75rem" }}
				onClick={() => {
					navigate("/social");
				}}
			>
				<GroupsIcon />
			</StyledIconButton>
		</Box>
	);
}

export default BottomNav;
