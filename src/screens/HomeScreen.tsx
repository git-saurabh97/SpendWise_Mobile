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

  const budgetUsed =
    monthlyBudget > 0
      ? Math.min(
          (totalSpent /
            monthlyBudget) *
            100,
          100
        ).toFixed(0)
      : '0';

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

      {/* HERO CARD */}

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>
          Amount Spent
        </Text>

        <Text style={styles.heroAmount}>
          ₹ {totalSpent}
        </Text>

        <Text style={styles.heroSub}>
          Monthly Budget:
          ₹ {monthlyBudget || 0}
        </Text>

        {/* PROGRESS */}

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Number(budgetUsed)}%` as any,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {budgetUsed}% of budget spent
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
            size={28}
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
            size={28}
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
            size={28}
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
              80% of your monthly
              budget
            </Text>
          </View>
        )}

      {/* RECENT HEADER */}

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

      {/* TRANSACTIONS */}

      {recentTransactions.length ===
      0 ? (
        <View style={styles.emptyCard}>
          <Ionicons
            name="wallet-outline"
            size={44}
            color="#AAA"
          />

          <Text style={styles.emptyTitle}>
            No Transactions Yet
          </Text>

          <Text style={styles.emptySub}>
            Start tracking your
            spending now
          </Text>
        </View>
      ) : (
        recentTransactions.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={
              styles.transactionCard
            }
            onPress={() =>
              router.push(
                `/transaction/${t.id}`
              )
            }
          >
            <View
              style={styles.leftRow}
            >
              <View
                style={
                  styles.iconCircle
                }
              >
                <Ionicons
                  name="wallet"
                  size={18}
                  color="#534AB7"
                />
              </View>

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

  heroCard: {
    backgroundColor: '#534AB7',
    borderRadius: 30,
    padding: 28,
    marginBottom: 28,
  },

  heroLabel: {
    color: '#D8D3FF',
    fontSize: 16,
  },

  heroAmount: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
    marginTop: 10,
  },

  heroSub: {
    color: '#D8D3FF',
    marginTop: 8,
    fontSize: 15,
  },

  progressBg: {
    height: 12,
    backgroundColor:
      'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginTop: 18,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },

  progressText: {
    color: '#E4DEFF',
    marginTop: 10,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 28,
  },

  actionCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: 'center',
  },

  actionText: {
    marginTop: 12,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  warningCard: {
    backgroundColor: '#FFF4E5',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  seeAll: {
    color: '#534AB7',
    fontWeight: '700',
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
    borderRadius: 28,
    paddingVertical: 50,
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  emptySub: {
    marginTop: 8,
    color: '#777',
  },
});