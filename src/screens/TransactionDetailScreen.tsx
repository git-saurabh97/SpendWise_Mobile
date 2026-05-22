import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useStore } from '../stores/useStore';

export default function TransactionDetailScreen() {
  const { id } =
    useLocalSearchParams();

  const transaction = useStore(
    (s) =>
      s.transactions.find(
        (t) => t.id === id
      )
  );

  if (!transaction) {
    return (
      <View style={styles.center}>
        <Text>
          Transaction not found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Transaction Detail
      </Text>

      <View style={styles.card}>
        <DetailRow
          label="Merchant"
          value={
            transaction.merchant
          }
        />

        <DetailRow
          label="Amount"
          value={`₹ ${transaction.amount}`}
        />

        <DetailRow
          label="Category"
          value={
            transaction.category ||
            'Others'
          }
        />

        <DetailRow
          label="Payment Method"
          value={
            transaction.paymentMethod
          }
        />

        <DetailRow
          label="Date"
          value={new Date(
            transaction.timestamp
          ).toLocaleString()}
        />

        <DetailRow
          label="Note"
          value={
            transaction.note ||
            '-'
          }
        />
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
  },

  row: {
    marginBottom: 20,
  },

  label: {
    color: '#777',
    marginBottom: 6,
  },

  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2A',
  },
});