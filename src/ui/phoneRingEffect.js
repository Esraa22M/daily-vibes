import { View, StyleSheet, Text } from "react-native";
import { Ring } from "./ring";
import { COLORS } from "../variables/styles";
const COLOR = COLORS.card;
const SIZE = 100;
import { useMemo } from "react";

export const PhoneRing = ({ children, animate, item}) => {


	return (
		<View style={styles.container}>
			<View style={[styles.dot, styles.center]}>
				{children}
				{(animate&&item) ? (
					[...Array(3).keys()].map((_, index) => (
						<Ring key={index} index={index} animate={animate} />
					))
				) : (
					<></>
				)}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		margin: "10%",
	},
	dot: {
		height: SIZE,
		width: SIZE,
		borderRadius: SIZE / 2,
		backgroundColor: COLOR,
	},
	center: { justifyContent: "center", alignItems: "center" },
});
