import { FlowRow } from "../components/activitiy/overrides";
import { Text, Animated, StyleSheet, Easing } from "react-native";
import { COLORS } from "../variables/styles";
import { useEffect, useRef } from "react";
const createTiming = (opacity, duration, toValue) =>
	Animated.timing(opacity, {
		toValue,
		duration: duration,
		easing: Easing.ease,
		useNativeDriver: false,
	});
export const LoadingDots = ({color}) => {
	const dotColor = color || COLORS.background;
	const dotOpacities = useRef(
		Array.from({ length: 3 }, () => new Animated.Value(0))
	).current;
	useEffect(() => {
		const dotShowAnimatingArray = dotOpacities.map((item) =>
			createTiming(item, 700,1)
		);

		const dotHideAnimatingArray = dotOpacities.map((item) =>
			createTiming(item, 500,0)
		);
		const sequence = Animated.sequence([
			Animated.stagger(200, dotShowAnimatingArray),
			Animated.delay(300),
			Animated.parallel(dotHideAnimatingArray),
		]);
		const loop = Animated.loop(sequence);
		loop.start();
		return () => {
			return loop.stop();
		};
	}, []);
	return (
		<FlowRow>
			{dotOpacities.map((item, index) => (
				<Animated.View style={[styles.dot, { opacity: item, backgroundColor:dotColor }, ]} key={index} />
			))}
		</FlowRow>
	);
};
const styles = StyleSheet.create({
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 5,
	},
});
