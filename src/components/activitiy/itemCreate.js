import { Pressable, StyleSheet, TextInput } from "react-native";
import { ModalComponent } from "../../modal/modal";
import { CustomButton, FlowRow, FlowText } from "./overrides";
import { COLORS } from "../../variables/styles";
import { useState } from "react";
import { generateRandomId } from "../../utils/customHooks";
export const ItemCreate = ({visible,onclose, onConfirm}) => {
	const [isFocus, setIsFocus] = useState(false);
	const [newItem, setNewItem] = useState({ id: "", title: "", description: "", isActive: false, time: 0 });
	const confirm = () => {
		const newGeneratedItem = { ...newItem, id: generateRandomId(10) };
		onConfirm(newGeneratedItem);
		cancel();
	};
	const cancel = () => {
		onclose();
	};
	return (
		<>{visible&&<ModalComponent visible={true} animationType={"fade"}>
			<TextInput
				placeholder="What's the next thing to do?"
				placeholderTextColor={COLORS.secondaryText}
				cursorColor={isFocus ? COLORS.secondaryText : "transparent"}
				style={[styles.input, isFocus && styles.inputFocus]}
				underlineColorAndroid={"transparent"}
				autoCorrect={false}
				onFocus={() => setIsFocus(true)}
				value={newItem.title}
				onBlur={() => setIsFocus(false)}
				onChangeText={(title) => setNewItem({ ...newItem, title })}
			/>
			<TextInput
				placeholder="Share the story behind your activity"
				placeholderTextColor={COLORS.secondaryText}
				cursorColor={isFocus ? COLORS.secondaryText : "transparent"}
				style={[styles.input, isFocus && styles.inputFocus, styles.textArea]}
				underlineColorAndroid={"transparent"}
				autoCorrect={false}
				multiline
				value={newItem.description}
				onFocus={() => setIsFocus(true)}
				onBlur={() => setIsFocus(false)}
				onChangeText={(description) => setNewItem({ ...newItem, description })}
			/>
			<FlowRow style={styles.buttonsWrapper}>
				<CustomButton text={"Confirm"} onPress={confirm} type={"primary"} disabled={newItem.title.length === 0} />
				<CustomButton text={"Cancel"} onPress={cancel} type={"primary"} outLineButton />
			</FlowRow>
			{/* <FlowRow style={styles.buttonsWrapper}>
				<Pressable
					style={({ pressed }) => [
						styles.button,
						pressed && styles.buttonPressed,
					]}
					onPress={confirm}
				>
					<FlowText style={styles.buttonText}>Confirm</FlowText>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						styles.button,
						pressed && styles.buttonPressed,
					]}
					onPress={cancel}
				>
					<FlowText style={styles.buttonText}>Cancel</FlowText>
				</Pressable>
			</FlowRow> */}
		</ModalComponent>}</>
	);
};
const styles = StyleSheet.create({
	mainText: { color: COLORS.secondaryText },
	input: {
		borderWidth: 1,
		borderColor: COLORS.card,
		marginVertical: 20,
		padding: 10,
		borderRadius: 5,
		color: COLORS.secondaryText,
		textDecorationLine: "none",
	},
	buttonsWrapper: { justifyContent: "space-between" },
	buttonText: { color: COLORS.secondaryText },
	buttonPressed: { backgroundColor: COLORS.activeBackground },
	inputFocus: { borderColor: COLORS.activeBackground },
	button: {
		backgroundColor: COLORS.card,
		padding: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "transparent",
	},
	textArea:{minHeight:100 , textAlignVertical:"top"}
});
