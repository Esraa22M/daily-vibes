import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../variables/styles";
import { LinearGradient } from "expo-linear-gradient";

export const FlowView = ({ children, style }) => {
	return <View style={{ ...styles.view, ...style }} >{children}</View>;
};
const styles = StyleSheet.create({
	view: {
		borderRadius: 10,
		padding: 15,
		height: 100,
		backgroundColor:COLORS.card,
		justifyContent: "center",
		// borderBottomWidth:3,
		// borderBottomColor:COLORS.borderColor,
		borderRadius:10,
		borderBottomRightRadius: 40,
	},
});
