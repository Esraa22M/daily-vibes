import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	Dimensions,
} from "react-native";
import { ModalComponent } from "../../modal/modal";
import { FlowText, FlowView, FlowRow, CustomButton } from "./overrides";
import { COLORS, SIZES } from "../../variables/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { ActivityTimer } from "./timer";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { storeDayItems } from "../../storage";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ItemDetails = ({
	showDetailsModal,
	setShowDetailsModal,
	setAnimate,
	item,
	time,
	onDelete,
	onSave,
}) => {
	const [title, setTitle] = useState({ value: "", isFocused: false });
	const [description, setDescription] = useState({
		value: "",
		isFocused: false,
	});
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		setTitle((prev) => {
			return { ...prev, value: item?.title ?? "" };
		});
		setDescription((prev) => {
			return { ...prev, value: item?.description ?? "" };
		});

		setIsEditing(false);
	}, [item]);

	const handleSave = () => {
		if (onSave) {
			onSave({ ...item, title:title?.value,description: description?.value });
		}
		setIsEditing(false);
	};

	const handleCancel = () => {description
		setTitle(item?.title ?? "");
		setDescription(item?.description ?? "");
		setIsEditing(false);
	};

	return (
		<ModalComponent visible={showDetailsModal} animationType="fade" fullScreen>
			<View style={styles.header}>
				<CustomButton
					text={<AntDesign name="arrowleft" size={SIZES.fontExtraLarge} color={COLORS.borderColor} />}
					isGhost
					onPress={() => {
						setShowDetailsModal(false);
						setAnimate(true);
					}}
				/>
			</View>

			<ActivityTimer
				item={item}
				time={item?.isActive ? time : item?.time}
				animate={item?.isActive}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			>
				<ScrollView
					style={styles.container}
					contentContainerStyle={{
						flexGrow: 1,
						padding: 20,
						minHeight: 0.4 * SCREEN_HEIGHT,
					}}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.detailsItem}>
						{isEditing ? (
							<TextInput
								value={title.value}
								onChangeText={(text) =>
									setTitle((prev) => ({ ...prev, value: text }))
								}
								onFocus={() =>
									setTitle((prev) => ({ ...prev, isFocused: true }))
								}
								onBlur={() =>
									setTitle((prev) => ({ ...prev, isFocused: false }))
								}
								placeholder="Title"
								style={[
									styles.textInput,
									title.isFocused
										? { borderColor: COLORS.text }
										: { borderColor: COLORS.activeBackground },
								]}
								selectionColor="grey"
								
								placeholderTextColor="grey"
							/>
						) : (
							<View>
								<FlowRow style={styles.textContainer}>
										<View style={ {marginRight:10}}><Feather
											name="activity"
											size={24}
											color={COLORS.borderColor}
										/></View>
									<View>
										<FlowText style={styles.hint}>Name</FlowText>

										<FlowText style={styles.title}>{title.value}</FlowText>
									</View>
								</FlowRow>
							</View>
						)}
					</View>

					<View style={styles.detailsItem}>
						{isEditing ? (
							<TextInput
								value={description.value}
								onChangeText={(text) =>
									setDescription((prev) => ({ ...prev, value: text }))
								}
								placeholder="Description"
								onFocus={() =>
									setDescription((prev) => ({ ...prev, isFocused: true }))
								}
								onBlur={() =>
									setDescription((prev) => ({ ...prev, isFocused: false }))
								}
								style={[
									styles.textInput,
									description.isFocused
										? { borderColor: COLORS.text }
										: { borderColor: COLORS.activeBackground },
									{ height: 100 },
								]}
								selectionColor="grey"
								placeholderTextColor="grey"
								multiline
							/>
						) : (
							<View>
									<FlowRow style={styles.textContainer}>
										<View style={ {marginRight:10}}><MaterialIcons name="description" size={24} color={COLORS.borderColor} /></View>
									<View>
										<FlowText style={styles.hint}>Description</FlowText>

										<FlowText style={styles.description}>{description.value}</FlowText>
									</View>
								</FlowRow>
							</View>
						)}
					</View>

					<FlowRow style={styles.buttonsContainer}>
						{isEditing ? (
							<>
								<CustomButton text="Save" onPress={handleSave} />
								<CustomButton
									text="Cancel"
									outLineButton
									onPress={handleCancel}
								/>
							</>
						) : (
							<>
								<CustomButton
									text="Edit"
									outLineButton
									onPress={() => setIsEditing(true)}
								/>

								<CustomButton
									text={<EvilIcons name="trash" size={SIZES.fontMedium} />}
									outLineButton
									isDanger
									onPress={() => onDelete && onDelete(item)}
								/>
							</>
						)}
					</FlowRow>
				</ScrollView>
			</KeyboardAvoidingView>
		</ModalComponent>
	);
};

// Memoization checking relevant fields
const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.showDetailsModal === nextProps.showDetailsModal &&
		prevProps.time === nextProps.time &&
		prevProps.item?.id === nextProps.item?.id &&
		prevProps.item?.title === nextProps.item?.title &&
		prevProps.item?.description === nextProps.item?.description &&
		prevProps.item?.time === nextProps.item?.time &&
		prevProps.item?.isActive === nextProps.item?.isActive
	);
};

export default React.memo(ItemDetails, areEqual);

const styles = StyleSheet.create({
	header: {
		justifyContent: "flex-start",
		alignSelf: "flex-start",
		textAlign: "left",
		width: 0.2 * SCREEN_WIDTH,
		padding: 10,
	},
	container: {
		borderRadius: 10,
		marginTop: SCREEN_HEIGHT * 0.1,
		marginBottom: SCREEN_HEIGHT * 0.05,
	},
	buttonsContainer: {
		justifyContent: "space-between",
		marginVertical: 10,
		alignItems: "center",
	},
	detailsItem: { marginVertical: 20 },
	title: {
		fontWeight: "bold",
		fontSize: SIZES.fontMedium,
		color: COLORS.activeBackground,
	},
	textContainer:{		paddingVertical: 20,		borderBottomWidth: 1,		borderBottomColor: COLORS.card,


},
	hint: {marginVertical:10 , color:'grey'},
	description: { color: COLORS.text ,		fontSize: SIZES.fontSmall,
},
	textInput: {
		borderColor: COLORS.activeBackground,
		borderWidth: 1,
		borderRadius: 10,
		padding: 16,
		color: COLORS.text,
	},
});
