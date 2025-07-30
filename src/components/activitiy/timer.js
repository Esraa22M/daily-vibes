import { View, StyleSheet } from "react-native";
import { FlowView } from "./overrides";
import { FlowText } from "./overrides";
import { PhoneRing } from "../../ui/phoneRingEffect";
import { FlowRow } from "./overrides";
import { COLORS } from "../../variables/styles";
import { SafeAreaView } from "react-native";
import { formatMilliseconds } from "../../utils/customHooks";
export const ActivityTimer = ({time,items}) => {
		const isAnyActive = items?.some(item=>item?.isActive)

	return (
		<PhoneRing items={items}><View style={styles.upperContainer}>
			
			<View style={styles.timerContainer}>
				{isAnyActive ? <FlowText>{formatMilliseconds(time)}</FlowText>:<FlowText>00:00:00</FlowText>}
			</View>
		</View></PhoneRing>
	);
};
const styles = StyleSheet.create({
	timerContainer: {
		Height: 150,
		paddingHorizontal:10,
		marginVertical: 10,
		minwidth: 150,
		borderRadius: 1500,
		justifyContent: "center",
		alignItems: "center",
	},
	upperContainer:{justifyContent:"center",alignItems:"center",}
});
