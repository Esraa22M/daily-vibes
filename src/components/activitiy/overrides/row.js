import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../variables/styles";

export const FlowRow = ({ children, style, justify }) => {
    return <View style={{...styles.row,...style }}>{children}</View>;
};
const styles = StyleSheet.create({ row: { flexDirection:'row', alignItems:'center', } });
