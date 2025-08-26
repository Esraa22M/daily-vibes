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
import  ItemDetails from "../components/activitiy/itemDetails";
export const HomeScreen = () => {
	const [items, setItems] = useState([]);
	const [time, setTime] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [savedStateBeforeModal, setSavedStateBeforeModal] = useState(null);
	const [foucedItem, setFocusedItem] = useState(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [animate, setAnimate] = useState(true);
	const startTimeRef = useRef(0);
	const timeRef = useRef(0);
const handleUpdateItem = (updatedItem) => {
	setItems((prevItems) => {
		const updatedItems = prevItems.map((item) =>
			item.id === updatedItem.id ? updatedItem : item
		)
		storeDayItems(updatedItems);
		return updatedItems;
	}
  );
};

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

const tickRef = useRef(null);

const startTick = () => {
  stopTick();
  const step = () => {
    const now = Date.now();
    const delta = now - startTimeRef.current;
    if (delta >= 100) {
      timeRef.current += delta;
      setTime(timeRef.current);
      startTimeRef.current = now;
    }
    tickRef.current = requestAnimationFrame(step);
  };
  tickRef.current = requestAnimationFrame(step);
};

const stopTick = () => {
  if (tickRef.current) {
    cancelAnimationFrame(tickRef.current);
    tickRef.current = null;
  }
};
const handleDeleteItem = (itemId) => {
	setItems((prevItems) => {
		const updatedItems = prevItems.filter((item) => item.id !== itemId);

		storeDayItems(updatedItems);

		return updatedItems;
	});
};

const handleAddPress = () => {
  stopTick();  // وقف التايمر قبل فتح المودال
  setItems((activities) => {
    const updated = updateTimeOnActiveItem(activities);
    saveToStorage(updated);
    return updated;
  });
  resetActivities();
  setShowModal(true);
};
const handleModalClose = (shouldRestore = true) => {
  setShowModal(false);
  if (shouldRestore) {
    restoreActivities();
    if (savedStateBeforeModal?.some((a) => a.isActive)) {
      startTimeRef.current = Date.now();
      startTick();
    }
  }
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
			<ItemDetails showDetailsModal={ showDetailsModal} setShowDetailsModal={setShowDetailsModal} setAnimate={setAnimate} item={foucedItem} time={time} onSave={handleUpdateItem} onDelete={handleDeleteItem}/>
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
							<FlowText style={styles.text}>{activeItem.title}</FlowText>
						) : (
							<FlowText style={styles.text}>Select Activity</FlowText>
						)}
					</View>
					<ActivityTimer time={time} item={activeItem} animate={ animate} />
					<FlowRow style={styles.listHeading}>
						<FlowText style={styles.text}>Activities</FlowText>
						
						<CustomButton text={<Entypo name="add-to-list" size={30} color={COLORS.borderColor} />} onPress={handleAddPress} type={"primary"} isGhost={true } />
					</FlowRow>
				</View>
				<View style={{flex:2}}>
					<FlatList
						data={items}
						keyExtractor={({ id }) => id}
						renderItem={({ item }) => (
							<ActivityItem {...item} onActivityChange={checkActivity} handleItemPress={() => { setShowDetailsModal(true); setAnimate(false); setFocusedItem(item) }} />
						)}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: { flex: 1, padding: 20 },
	listHeading: { paddingVertical: 10, justifyContent: "space-between" },
	text: { fontSize: 17, fontWeight: "bold", color: COLORS.borderColor },
});
