import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

import { useStore } from '../stores/useStore';

export default function HomeScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );

  const totalSpent = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Home
      </Text>

      {/* TOTAL CARD */}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total Spent
        </Text>

        <Text style={styles.totalAmount}>
          ₹ {totalSpent}
        </Text>
      </View>

      {/* TRANSACTIONS */}

      <Text style={styles.sectionTitle}>
        Recent Transactions
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 160,
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No transactions yet
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text style={styles.merchant}>
                {item.merchant}
              </Text>

              <Text style={styles.date}>
                {new Date(
                  item.timestamp
                ).toLocaleString()}
              </Text>

              {item.category && (
                <Text style={styles.category}>
                  {item.category}
                </Text>
              )}
            </View>

            <Text style={styles.amount}>
              ₹ {item.amount}
            </Text>
          </View>
        )}
      />
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

  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2C2C2A',
  },

  totalCard: {
    backgroundColor: '#534AB7',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },

  totalLabel: {
    color: '#D8D3FF',
    fontSize: 16,
  },

  totalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C2C2A',
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  merchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2A',
  },

  date: {
    marginTop: 4,
    color: '#777',
    fontSize: 12,
  },

  category: {
    marginTop: 6,
    color: '#534AB7',
    fontWeight: '600',
  },

  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#777',
  },
});