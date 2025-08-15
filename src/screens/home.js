import { View, FlatList, StyleSheet, Platform, AppState } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityItem } from "../components/activitiy/item";
import { ActivityTimer } from "../components/activitiy/timer";
import {
	CustomButton,
	FlowRow,
	FlowText,
} from "../components/activitiy/overrides";
import data from "../data/activities.json";
import { COLORS } from "../variables/styles";
import { isStorageEnabled, loadDayItems, storeDayItems } from "../storage";
import { usePrevious } from "../utils/customHooks";
import { ItemCreate } from "../components/activitiy/itemCreate";
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from "react-native/Libraries/NewAppScreen";
export const HomeScreen = () => {
	const [items, setItems] = useState([]);
	const [time, setTime] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [savedStateBeforeModal, setSavedStateBeforeModal] = useState(null);

	const startTimeRef = useRef(0);
	const timeRef = useRef(0);
	const intervalRef = useRef(null);

	const saveToStorage = (data) => {
		if (
			typeof isStorageEnabled === "function"
				? isStorageEnabled()
				: isStorageEnabled
		) {
			storeDayItems(data);
		}
	};

	const resetActivities = () => {
		setItems((current) =>
			current.map((item) => ({ ...item, isActive: false }))
		);
	};

	const restoreActivities = () => {
		if (savedStateBeforeModal) {
			setItems(savedStateBeforeModal);
			setSavedStateBeforeModal(null);
		}
	};

	const activeItem = useMemo(
		() => items.find((item) => item.isActive),
		[items]
	);
	const prevItem = usePrevious(activeItem);

	const updateTimeOnActiveItem = (activities) => {
		const activeIdx = activities.findIndex((a) => a.isActive);
		if (activeIdx > -1) {
			return activities.map((a, i) =>
				i === activeIdx ? { ...a, time: timeRef.current } : a
			);
		}
		return activities;
	};

	const checkActivity = ({ id, state }) => {
		setItems((activities) => {
			const candidateIdx = activities.findIndex((a) => a.id === id);
			if (candidateIdx > -1 && activities[candidateIdx].isActive !== state) {
				let updated = updateTimeOnActiveItem(activities);
				updated = updated.map((a) =>
					a.id === id ? { ...a, isActive: state } : { ...a, isActive: false }
				);
				saveToStorage(updated);
				return updated;
			}
			return activities;
		});
	};

	useEffect(() => {
		(async () => {
			const dailyVibes = await loadDayItems();
			setItems(Array.isArray(dailyVibes) ? dailyVibes : data);
		})();
	}, []);

	useEffect(() => {
		const isSameItem = activeItem && prevItem && prevItem.id === activeItem.id;

		if (activeItem) {
			if (!isSameItem) {
				timeRef.current = activeItem.time;
				startTimeRef.current = Date.now();
			}
			startTick();
		} else {
			stopTick();
			timeRef.current = 0;
			setTime(0);
		}

		return () => stopTick();
	}, [activeItem]);

	useEffect(() => {
		const save = () => {
			setItems((activities) => {
				const updated = updateTimeOnActiveItem(activities);
				saveToStorage(updated);
				return updated;
			});
		};

		if (Platform.OS === "web") {
			window.addEventListener("beforeunload", save);
			return () => window.removeEventListener("beforeunload", save);
		} else {
			const handleAppStateChange = (appState) => {
				if (appState === "background" || appState === "inactive") {
					save();
				}
			};
			const sub = AppState.addEventListener("change", handleAppStateChange);
			return () => sub.remove();
		}
	}, []);

	const startTick = () => {
		stopTick();
		intervalRef.current = setInterval(() => {
			const now = Date.now();
			const delta = now - startTimeRef.current;
			if (delta >= 100) {
				timeRef.current += delta;
				setTime(timeRef.current);
				startTimeRef.current = now;
			}
		}, 100);
	};

	const stopTick = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const handleAddPress = () => {
		setItems((activities) => {
			const updated = updateTimeOnActiveItem(activities);
			saveToStorage(updated);
			return updated;
		});

		resetActivities();

		setShowModal(true);
	};

	const handleModalClose = (shouldRestore = true) => {
		if (shouldRestore) {
			restoreActivities();
			if (savedStateBeforeModal?.some((a) => a.isActive)) {
				startTimeRef.current = Date.now();
				startTick();
			}
		}
		setShowModal(false);
	};
	const addItem = (newItem) => {
		setItems((activities) => {
			const newActivities = [...activities, newItem];
			saveToStorage(newActivities);
			return newActivities;
		});
	};
	return (
		<View style={{ flex: 1 }}>
			<ItemCreate
				visible={showModal}
				onclose={() => handleModalClose(true)}
				onConfirm={addItem}
			/>
			<View style={styles.screenContainer}>
				<View style={{ flex:1 }}>
					<View
						style={{
							marginVertical: 20,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{activeItem ? (
							<FlowText>{activeItem.title}</FlowText>
						) : (
							<FlowText style={styles.text}>Select Activity</FlowText>
						)}
					</View>
					<ActivityTimer time={time} items={items} />
					<FlowRow style={styles.listHeading}>
						<FlowText style={styles.text}>Activities</FlowText>
						
						<CustomButton text={<Entypo name="add-to-list" size={30} color={COLORS.activeBackground} />} onPress={handleAddPress} type={"primary"} isGhost={true } />
					</FlowRow>
				</View>
				<View style={{flex:2}}>
					<FlatList
						data={items}
						keyExtractor={({ id }) => id}
						renderItem={({ item }) => (
							<ActivityItem {...item} onActivityChange={checkActivity} />
						)}
						// showsVerticalScrollIndicator={false}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: { flex: 1, padding: 20 },
	listHeading: { paddingVertical: 10, justifyContent: "space-between" },
	text: { fontSize: 17, fontWeight: "bold", color: COLORS.text },
});
