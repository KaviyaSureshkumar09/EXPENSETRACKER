// app/index.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import ExpenseItem from '../components/ExpenseItem';
import { getExpenses, deleteExpense } from '../storage/expenses';
import { getCategories } from '../storage/categories';

const screenWidth = Dimensions.get('window').width;

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function Index() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [sort, setSort] = useState('latest');

  // Reload data every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getExpenses();
        setList(data || []);
        const cats = await getCategories();
        setCategories(cats || []);
      };
      load();
    }, [])
  );

  const refresh = async () => {
    const data = await getExpenses();
    setList(data || []);
  };

  // Totals
  const today = new Date();
  const totalToday = list
    .filter((e) => isSameDay(new Date(e.date), today))
    .reduce((s, e) => s + e.amount, 0);

  const startWeek = getStartOfWeek(today);
  const totalWeek = list
    .filter((e) => new Date(e.date) >= startWeek)
    .reduce((s, e) => s + e.amount, 0);

  const totalMonth = list
    .filter(
      (e) =>
        new Date(e.date).getMonth() === today.getMonth() &&
        new Date(e.date).getFullYear() === today.getFullYear()
    )
    .reduce((s, e) => s + e.amount, 0);

  const totalAll = list.reduce((s, e) => s + e.amount, 0);

  // Pie chart data (current month)
  const categoryTotals = {};
  list.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }
  });

  const chartData = Object.keys(categoryTotals).map((key, i) => ({
    name: key,
    population: categoryTotals[key],
    color: ['#2f95dc', '#ff6b6b', '#4ecdc4', '#feca57', '#5f27cd'][i % 5],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  // Filter + search + sort
  const filtered = list
    .filter((e) =>
      search ? e.note?.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((e) => (filterCat !== 'All' ? e.category === filterCat : true))
    .sort((a, b) =>
      sort === 'latest' ? new Date(b.date) - new Date(a.date) : b.amount - a.amount
    );

  const onEdit = (expense) => {
    router.push({ pathname: '/add', params: { id: expense.id } });
  };

  const onDelete = (expense) => {
    Alert.alert('Delete', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteExpense(expense.id);
          await refresh();
        },
      },
    ]);
  };

  // Header for FlatList (summary, pie, search, filters)
  const ListHeader = () => (
    <View>
      {/* Title */}
      <View style={styles.titleRow}>
        <Ionicons name="wallet-outline" size={20} color="#2f95dc" />
        <Text style={styles.appTitle}>  Personal Finance Tracker</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today</Text>
          <Text style={styles.cardValue}>₹{totalToday}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>This Week</Text>
          <Text style={styles.cardValue}>₹{totalWeek}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>This Month</Text>
          <Text style={styles.cardValue}>₹{totalMonth}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total</Text>
          <Text style={styles.cardValue}>₹{totalAll}</Text>
        </View>
      </View>

      {/* Pie Chart (white card) */}
      {chartData.length > 0 && (
        <View style={styles.pieCard}>
          <PieChart
            data={chartData.map((d) => ({
              name: d.name,
              population: d.population,
              color: d.color,
              legendFontColor: d.legendFontColor,
              legendFontSize: d.legendFontSize,
            }))}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: () => '#000000',
              labelColor: () => '#000000',
            }}
            backgroundColor="transparent"
            accessor="population"
            paddingLeft="12"
            absolute
            style={{ borderRadius: 12 }}
          />
        </View>
      )}

      {/* Search */}
      <TextInput
        placeholder="🔍 Search by note..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filters (horizontal ScrollView to avoid nested FlatList) */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          {['All', ...categories.map((c) => c.name)].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterBtn, filterCat === item && styles.filterActive]}
              onPress={() => setFilterCat(item)}
            >
              <Text style={{ color: filterCat === item ? '#fff' : '#2f95dc', fontWeight: '600' }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Sort toggle */}
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSort((prev) => (prev === 'latest' ? 'highest' : 'latest'))}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              {sort === 'latest' ? '⬇️ Latest' : '⬆️ Highest'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} onEdit={onEdit} onDelete={onDelete} />}
        ListEmptyComponent={<Text style={styles.empty}>✨ No expenses found</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={<ListHeader />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  appTitle: { fontSize: 20, fontWeight: 'bold', color: '#2f95dc', textAlign: 'center', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
  card: {
    flex: 1,
    backgroundColor: '#2f95dc',
    padding: 10,
    margin: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardLabel: { fontSize: 12, color: '#fff' },
  cardValue: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  pieCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  search: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
  },
  filters: { marginTop: 10, paddingVertical: 6 },
  filterBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2f95dc',
    marginHorizontal: 4,
  },
  filterActive: { backgroundColor: '#2f95dc' },
  sortBtn: {
    backgroundColor: '#2f95dc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 14, color: '#666' },
});