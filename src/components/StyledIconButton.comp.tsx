import React from "react";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { ButtonProps, alpha } from "@mui/material";

const ContainedIconButton = styled(IconButton)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	padding: theme.spacing(1.5),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[2],
	transition: theme.transitions.create(["background-color", "box-shadow"], {
		duration: theme.transitions.duration.short,
	}),
	"&:hover": {
		backgroundColor: alpha(theme.palette.primary.main, 0.85),
		boxShadow: theme.shadows[4],
	},
	"&:disabled": {
		backgroundColor: theme.palette.action.disabledBackground,
		color: theme.palette.action.disabled,
		boxShadow: "none",
	},
}));

interface Props extends ButtonProps {
	children: React.ReactNode;
}

const StyledIconButton: React.FC<Props> = ({ children, ...props }) => {
	return <ContainedIconButton {...props}>{children}</ContainedIconButton>;
};

export default StyledIconButton;
