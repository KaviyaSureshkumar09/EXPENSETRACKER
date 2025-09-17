import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  getCategories,
  saveCategory,
  clearCategories,
} from '../storage/categories';
import { clearExpenses } from '../storage/expenses';

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newIcon, setNewIcon] = useState('✨');

  useEffect(() => {
    const load = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    load();
  }, []);

  const addCategory = async () => {
    if (!newCat) return;
    await saveCategory({ name: newCat, icon: newIcon });
    const cats = await getCategories();
    setCategories(cats);
    setNewCat('');
  };

  const handleClear = () => {
    Alert.alert('Confirm', 'Clear ALL expenses and categories?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearExpenses();
          await clearCategories();
          setCategories([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <Text style={styles.subtitle}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text style={styles.catItem}>
            {item.icon} {item.name}
          </Text>
        )}
        ListEmptyComponent={<Text>No categories yet.</Text>}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Category name"
          value={newCat}
          onChangeText={setNewCat}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 6 }]}
          placeholder="Emoji"
          value={newIcon}
          onChangeText={setNewIcon}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>🗑️ Clear All Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2f95dc', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  catItem: { fontSize: 16, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addBtn: {
    backgroundColor: '#2f95dc',
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
  },
  clearBtn: {
    marginTop: 20,
    backgroundColor: '#e63946',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});