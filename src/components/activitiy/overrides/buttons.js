import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../variables/styles";

export const CustomButton = ({
	text,
	type = "primary",
	isGhost = false,
	isDanger = false,
	disabled = false,
	outLineButton = false,
	...rest
}) => {
	const ghostButton = isGhost;
	const isDisabled = disabled;

	let backgroundColor = COLORS.activeBackground;
	let borderColor = COLORS.activeBackground;
	let textColor = COLORS.secondaryText;
	let borderWidth = 0;

	if (outLineButton) {
		backgroundColor = "transparent";
		textColor = COLORS.text;
		borderWidth = 1;
		if (isDisabled) {
			textColor = COLORS.card;
			borderColor = COLORS.card;
		}
		if (isDanger) {
			backgroundColor = "transparent";
			textColor = COLORS.brightRed;
			borderColor = COLORS.brightRed;
		}
	} else if (isDisabled) {
		backgroundColor = COLORS.card;
		borderColor = COLORS.card;
		borderWidth = 1;
		textColor = "grey";
	} else if (isGhost) {
		borderWidth = 0;
		backgroundColor = "";
		textColor = COLORS.activeBackground;
	}

	return (
		<Pressable
			{...rest}
			disabled={isDisabled}
			style={({ pressed }) => [
				styles.button,
				{ backgroundColor, borderColor, borderWidth },
				pressed && !isDisabled && { opacity: 0.6 },
			]}
		>
			<Text style={{ color: textColor }}>{text}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		minWidth: 80,
		justifyContent: "center",
		alignSelf: "stretch",
	},
});
