import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.category}>
          {expense.category} - ₹{expense.amount}
        </Text>
        {expense.note ? <Text style={styles.note}>{expense.note}</Text> : null}
        <Text style={styles.date}>
          {new Date(expense.date).toLocaleString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(expense)}
          style={[styles.btn, { backgroundColor: '#2f95dc' }]}
        >
          <Text style={styles.btnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(expense)}
          style={[styles.btn, { backgroundColor: '#e63946' }]}
        >
          <Text style={styles.btnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
  },
  category: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  note: { fontSize: 14, color: '#666' },
  date: { fontSize: 12, color: '#999' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    padding: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
