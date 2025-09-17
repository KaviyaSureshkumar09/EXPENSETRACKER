import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'categories';

const defaultCategories = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transport', icon: '🚌' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bill', icon: '💡' },
  { name: 'Other', icon: '📦' },
];

export const getCategories = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (json) return JSON.parse(json);
    await AsyncStorage.setItem(KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  } catch (e) {
    return defaultCategories;
  }
};

export const saveCategory = async (category) => {
  const list = await getCategories();
  const updated = [...list, category];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};

export const clearCategories = async () => {
  await AsyncStorage.removeItem(KEY);
};