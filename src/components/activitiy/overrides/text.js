import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../../variables/styles";

export const FlowText = ({ children, style }) => {
	return <Text style={{...styles.text,...style }}>{children}</Text>;
};
const styles = StyleSheet.create({ text: { color: COLORS.text } });
