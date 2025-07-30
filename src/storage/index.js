import AsyncStorage from "@react-native-async-storage/async-storage";
export const storeData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		console.error("Error saving data", e);
		return false;
	}
};
export const loadData = async (key) => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.error("Error loading data", e);
	}
};
export const isStorageEnabled = async () => {
	try {
		await AsyncStorage.setItem("testkey", "testValue");
		await AsyncStorage.getItem("testkey");
		return true;
	} catch (err) {
		console.error(`${err}`);
		return false;
	}
};
export const storeDayItems = async (items) => {
	return storeData("dayVibes", items);
};
export const loadDayItems = async () => {
	return loadData("dayVibes");
};
