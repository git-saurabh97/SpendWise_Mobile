import {
  View,
  Text,
 StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import { useStore } from '../stores/useStore';

export default function HomeScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );

  const monthlyBudget = useStore(
    (s) => s.monthlyBudget
  );

  const totalSpent =
    transactions.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const remaining =
    monthlyBudget - totalSpent;

  const recentTransactions =
    transactions.slice(0, 5);

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {greeting}
          </Text>

          <Text style={styles.userName}>
            Saurabh 👋
          </Text>
        </View>

        <View style={styles.profileCircle}>
          <Ionicons
            name="person"
            size={24}
            color="#FFF"
          />
        </View>
      </View>

      {/* BALANCE CARD */}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Total Spent
        </Text>

        <Text style={styles.balanceAmount}>
          ₹ {totalSpent}
        </Text>

        <Text style={styles.balanceSub}>
          Remaining Budget:
          ₹ {remaining}
        </Text>
      </View>

      {/* QUICK ACTIONS */}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.push('/pay')
          }
        >
          <Ionicons
            name="card"
            size={26}
            color="#534AB7"
          />

          <Text style={styles.actionText}>
            Pay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.push('/history')
          }
        >
          <Ionicons
            name="time"
            size={26}
            color="#534AB7"
          />

          <Text style={styles.actionText}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.push('/insights')
          }
        >
          <Ionicons
            name="pie-chart"
            size={26}
            color="#534AB7"
          />

          <Text style={styles.actionText}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      {/* WARNING */}

      {monthlyBudget > 0 &&
        totalSpent >
          monthlyBudget * 0.8 && (
          <View style={styles.warningCard}>
            <Ionicons
              name="warning"
              size={22}
              color="#FF8A00"
            />

            <Text
              style={styles.warningText}
            >
              You have used more than
              80% of your budget.
            </Text>
          </View>
        )}

      {/* RECENT TRANSACTIONS */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Transactions
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push('/history')
          }
        >
          <Text style={styles.seeAll}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.length ===
      0 ? (
        <View style={styles.emptyCard}>
          <Ionicons
            name="wallet"
            size={36}
            color="#AAA"
          />

          <Text style={styles.emptyText}>
            No transactions yet
          </Text>
        </View>
      ) : (
        recentTransactions.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.transactionCard}
            onPress={() =>
              router.push(
                `/transaction/${t.id}`
              )
            }
          >
            <View>
              <Text
                style={
                  styles.transactionMerchant
                }
              >
                {t.merchant}
              </Text>

              <Text
                style={
                  styles.transactionMeta
                }
              >
                {t.category ||
                  'Others'}
              </Text>
            </View>

            <Text
              style={
                styles.transactionAmount
              }
            >
              ₹ {t.amount}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  greeting: {
    color: '#777',
    fontSize: 16,
  },

  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C2C2A',
    marginTop: 4,
  },

  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#534AB7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceCard: {
    backgroundColor: '#534AB7',
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
  },

  balanceLabel: {
    color: '#D8D3FF',
    fontSize: 16,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 10,
  },

  balanceSub: {
    color: '#D8D3FF',
    marginTop: 10,
    fontSize: 15,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 24,
  },

  actionCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: 'center',
  },

  actionText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#2C2C2A',
  },

  warningCard: {
    backgroundColor: '#FFF4E5',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  warningText: {
    marginLeft: 12,
    color: '#A15C00',
    fontWeight: '600',
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  seeAll: {
    color: '#534AB7',
    fontWeight: '600',
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  transactionMerchant: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  transactionMeta: {
    marginTop: 4,
    color: '#777',
  },

  transactionAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#534AB7',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 12,
    color: '#777',
    fontSize: 16,
  },
});