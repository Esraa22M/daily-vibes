import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { COLORS } from "../variables/styles";
const _color = "#6e01ef";
const _size = 120;
export default function WaveThingy({children}) {
	return (
		<View style={{ flex: 2, alignItems: "center", justifyContent: "center", }}>
			<View style={[styles.dot, styles.center]}>
				{[...Array(3).keys()].map((_, index) => (
					<MotiView
						style={[StyleSheet.absoluteFillObject, styles.dot]}
						key={index}
						from={{ opacity: 0.7, scale: 1 }}
						transition={{
							type: "timing",
							duration: 2000,
							easing: Easing.out(Easing.ease),
							loop: true,
							delay: index * 400,
							repeatReverse: false,
						}}
						animate={{ opacity: 0, scale: 2.5 }}
					></MotiView>
				))}
				{children}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	dot: {
		width: _size,
		height: _size,
		borderRadius: _size,
		backgroundColor:COLORS.card,
		
	},
	center: { alignItems: "center", justifyContent: "center" },
});
