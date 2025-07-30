import "react-native-reanimated"; // أول حاجة
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { HomeScreen } from "./src/screens/home";
import { COLORS } from "./src/variables/styles";
import { useEffect, useState } from "react";
import { isStorageEnabled } from "./src/storage";
export default function App() {
	const [isAsyncStorageEnabled, setIsAsyncStorageEnabled] = useState(false);
	useEffect(() => {
		const checkStorage = async () => {
			const isEnabled = await isStorageEnabled();
      setIsAsyncStorageEnabled(isEnabled)
		};
		checkStorage();
	}, []);
	return (
		<View style={styles.container}>
      {/* {!isAsyncStorageEnabled?<Text>No Activities to show</Text>:<HomeScreen />} */}
	  <HomeScreen/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
});
