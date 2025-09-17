import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getExpenses, saveExpense, updateExpense } from '../storage/expenses';
import { getCategories } from '../storage/categories';

export default function AddExpense() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Food');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const cats = await getCategories();
      setCategories(cats);

      if (id) {
        const list = await getExpenses();
        const exp = list.find((e) => e.id === id);
        if (exp) {
          setAmount(exp.amount.toString());
          setNote(exp.note || '');
          setCategory(exp.category);
        }
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (id) {
      await updateExpense({
        id,
        amount: parseFloat(amount),
        category,
        note,
        date: new Date().toISOString(),
      });
    } else {
      await saveExpense({
        amount: parseFloat(amount),
        category,
        note,
        date: new Date().toISOString(),
      });
    }

    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {id ? '✏️ Edit Expense' : '➕ Add Expense'}
      </Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.name}
            style={[
              styles.catBtn,
              category === c.name && styles.catBtnActive,
            ]}
            onPress={() => setCategory(c.name)}
          >
            <Text
              style={{
                color: category === c.name ? '#fff' : '#2f95dc',
                fontWeight: '600',
              }}
            >
              {c.icon} {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional note"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          💾 Save Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2f95dc', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  catBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2f95dc',
    backgroundColor: '#fff',
    margin: 4,
  },
  catBtnActive: { backgroundColor: '#2f95dc' },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#2f95dc',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});