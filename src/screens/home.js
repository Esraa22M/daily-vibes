import { View, FlatList, StyleSheet, Platform, AppState } from "react-native";
import { ActivityItem } from "../components/activitiy/item";
import { ActivityTimer } from "../components/activitiy/timer";
import { FlowRow } from "../components/activitiy/overrides";
import { FlowText } from "../components/activitiy/overrides";
import data from "../data/activities.json";
import { COLORS } from "../variables/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { isStorageEnabled, loadDayItems, storeDayItems } from "../storage";
import { usePrevious } from "../utils/customHooks";
import { ItemCreate } from "../components/activitiy/itemCreate";
export const HomeScreen = () => {
	const [items, setItems] = useState([]);
	const [time, setTime] = useState(0);
	const startTimeRef = useRef(0);
	const animationFrameRef = useRef(null);
	const timeRef = useRef(0);

	const saveToStorage = (data) => {
		if (isStorageEnabled) {
			storeDayItems(data);
		}
	};

	const activeItem = useMemo(() => {
		return items?.find((item) => item.isActive);
	}, [items]);
	const prevItem = usePrevious(activeItem);
	const checkActivity = ({ id, state }) => {
		setItems((activities) => {
			const candidateIdx = activities.findIndex((a) => a.id === id);
			if (candidateIdx > -1 && activities[candidateIdx].isActive !== state) {
				updateTimeOnActiveItem(activities);
				const newActivities = activities.map((a) =>
					a.id === id ? { ...a, isActive: state } : { ...a, isActive: false }
				);
				saveToStorage(newActivities);
				return newActivities;
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
		const isSameTime = activeItem && prevItem && prevItem.id === activeItem.id;
		if (activeItem) {
			if (!isSameTime) {
				timeRef.current = activeItem.time;
				startTimeRef.current = Date.now();
			}
			tick();
		} else {
			timeRef.current = 0;
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		}
		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		};
	}, [activeItem]);
	useEffect(() => {
		const save = () => {
			setItems((activities) => {
				updateTimeOnActiveItem(activities);
				saveToStorage(activities);
				return activities;
			});
		};
		if (Platform.OS === "web") {
			window.addEventListener("beforeunload", save);
			return () => {
				window.removeEventListener("beforeunload", save);
			};
		} else {
			const handleAppStateChange = (appState) => {
				if (appState === "background" || appState === "inactive") {
					save();
				}
			};
			const subscribe = AppState.addEventListener(
				"change",
				handleAppStateChange
			);
			return () => {
				subscribe.remove();
			};
		}
	}, []);
	const tick = () => {
		const currentTime = Date.now();
		const timeDelta = currentTime - startTimeRef.current;
		if (timeDelta >= 100) {
			timeRef.current += timeDelta;

			setTime(timeRef.current);

			startTimeRef.current = Date.now();
		}
		animationFrameRef.current = requestAnimationFrame(tick);
	};
	const updateTimeOnActiveItem = (activities) => {
		const activeIdx = activities.findIndex((activitiy) => activitiy.isActive);
		if (activeIdx > -1) {
			activities[activeIdx].time = timeRef.current;
		}
	};
	return (
		<View style={{flex:1}}>
			<ItemCreate />
			<View style={styles.screenContainer}>
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
					<FlowText style={styles.text}>Add</FlowText>
				</FlowRow>
				<View style={{ flex: 3 }}>
					<FlatList
						data={items}
						keyExtractor={({ id }) => id}
						renderItem={({ item }) => (
							<ActivityItem {...item} onActivityChange={checkActivity} />
						)}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: { flex:1, padding: 20 },
	listHeading: { paddingVertical: 10, justifyContent: "space-between" },
	text: { fontSize: 17, fontWeight: "bold", color: COLORS.text },
});
