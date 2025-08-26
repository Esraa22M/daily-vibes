import { Modal, View, StyleSheet } from "react-native";
import { COLORS } from "../variables/styles";
import Constants from "expo-constants";
export const ModalComponent = ({ children, animationType, visible , bgColor, fullScreen}) => {
    const defaultBgColor = bgColor || COLORS.cardOpacity;
	const isFullScreen = fullScreen ??false;
	const containerStyle = isFullScreen ? {backgroundColor:"#1e2025", paddingTop:Constants.statusBarHeight} : {justifyContent:"center", alignItems:"center"};
	return (
		<Modal
			transparent={true}
			animationType={animationType}
			visible={visible}
				statusBarTranslucent={true}

		>
            <View style={[styles.modalContainer, { backgroundColor: defaultBgColor },containerStyle]}>
                <View style={[styles.modalContent, {backgroundColor:"#1e2025"} ]}>{children}</View>
			</View>
		</Modal>
	);
};
const styles = StyleSheet.create({
	modalContainer: { flex: 1 ,zIndex:100},
	modalContent: {minWidth:350 , padding:20 , borderRadius:10},
});
