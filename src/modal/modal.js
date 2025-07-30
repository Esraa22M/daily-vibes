import { Modal, View, StyleSheet } from "react-native";
import { COLORS } from "../variables/styles";
export const ModalComponent = ({ children, animationType, visible , bgColor}) => {
    const defaultBgColor = bgColor || COLORS.cardOpacity;
	return (
		<Modal
			transparent={true}
			animationType={animationType}
			visible={visible}
				statusBarTranslucent={true}

		>
            <View style={[styles.modalContainer, { backgroundColor: defaultBgColor }]}>
                <View style={[styles.modalContent, {backgroundColor:"#1e2025"} ]}>{children}</View>
			</View>
		</Modal>
	);
};
const styles = StyleSheet.create({
	modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", },
	modalContent: {minWidth:350 , padding:20 , borderRadius:10},
});
