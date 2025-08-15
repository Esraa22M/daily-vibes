import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../variables/styles";

export const CustomButton = ({ text, type = "primary", isGhost = false, disabled = false, ...rest }) => {
	const ghostButton = isGhost;
	const isDisabled = disabled;

	let backgroundColor = COLORS.activeBackground;
	let borderColor = COLORS.activeBackground;
	let textColor = COLORS.secondaryText;

	if (ghostButton) {
		backgroundColor = "transparent";
		textColor = COLORS.activeBackground;
		if (isDisabled) {
			borderColor = "transparent";
			textColor = COLORS.card;
					borderWidth=1,

				 borderColor = COLORS.card;

		}
	} else if (isDisabled) {
		backgroundColor = COLORS.card;
						 borderColor = COLORS.card;
		borderWidth= 1,

		textColor =  "grey";
	}
	return (
		<Pressable
			{...rest}
			disabled={isDisabled}
			style={({ pressed }) => [
				styles.button,
				{ backgroundColor, borderColor },
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
		justifyContent: "center",
	},
});
