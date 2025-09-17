// storage/expenses.js
import 'react-native-get-random-values'; // safe to keep here too
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'expenses_v1';

export const getExpenses = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('getExpenses error', e);
    return [];
  }
};

export const saveExpense = async (expense) => {
  try {
    // allow caller to pass id (for edits), otherwise generate
    const id = expense.id || uuidv4();
    const newExp = {
      id,
      amount: expense.amount,
      category: expense.category,
      categoryId: expense.categoryId || null,
      categoryEmoji: expense.categoryEmoji || null,
      note: expense.note || '',
      date: expense.date || new Date().toISOString(),
    };

    const list = await getExpenses();
    // push new at start so latest appears first
    const updated = [newExp, ...list];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return newExp;
  } catch (e) {
    console.error('saveExpense error', e);
    throw e;
  }
};

export const getExpenseById = async (id) => {
  try {
    const list = await getExpenses();
    return list.find((e) => e.id === id);
  } catch (e) {
    console.error('getExpenseById error', e);
    return null;
  }
};

export const updateExpense = async (expense) => {
  try {
    const list = await getExpenses();
    const updated = list.map((e) => (e.id === expense.id ? { ...e, ...expense } : e));
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return expense;
  } catch (e) {
    console.error('updateExpense error', e);
    throw e;
  }
};

export const deleteExpense = async (id) => {
  try {
    const list = await getExpenses();
    const filtered = list.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('deleteExpense error', e);
    return false;
  }
};

export const clearExpenses = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error('clearExpenses error', e);
  }
};