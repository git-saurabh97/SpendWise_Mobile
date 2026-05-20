import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  PieChart,
} from 'react-native-chart-kit';
import { useState } from 'react';

import { useStore } from '../stores/useStore';

const screenWidth =
  Dimensions.get('window').width;

export default function InsightsScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );
  const now = new Date();

const filteredTransactions =
  transactions.filter((t) => {
    const date = new Date(
      t.timestamp
    );

    const diff =
      now.getTime() -
      date.getTime();

    const days =
      diff /
      (1000 * 60 * 60 * 24);

    switch (filter) {
      case 'daily':
        return days <= 1;

      case 'weekly':
        return days <= 7;

      case 'monthly':
        return days <= 30;

      case 'quarterly':
        return days <= 90;

      default:
        return true;
    }
  });

const categories = [
  'All',
  ...new Set(
    filteredTransactions.map(
      (t) =>
        t.category || 'Others'
    )
  ),
];

const finalTransactions =
  filteredTransactions.filter(
    (t) => {
      if (
        selectedCategory ===
        'All'
      )
        return true;

      return (
        (t.category || 'Others') ===
        selectedCategory
      );
    }
  );
  const [filter, setFilter] =
  useState<
    'daily' |
    'weekly' |
    'monthly' |
    'quarterly'
  >('monthly');

    const [selectedCategory,
    setSelectedCategory] =
    useState('All');





  const totalSpent = finalTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const categoryTotals: Record<
    string,
    number
  > = {};

  finalTransactions.forEach((t) => {
    const category =
      t.category || 'Others';

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      t.amount;
  });

  const pieData = Object.entries(
    categoryTotals
  ).map(([category, amount], index) => ({
    name: category,
    amount,
    color: [
      '#534AB7',
      '#7B6EF6',
      '#A393FF',
      '#D1C7FF',
      '#8B80F9',
      '#C6BAFF',
    ][index % 6],

    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      <Text style={styles.heading}>
        Insights
      </Text>
      
      <View style={styles.filterRow}>
  {[
    'daily',
    'weekly',
    'monthly',
    'quarterly',
  ].map((item) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.filterButton,

        filter === item &&
          styles.activeFilter,
      ]}
      onPress={() =>
        setFilter(item as any)
      }
    >
      <Text
        style={[
          styles.filterText,

          filter === item &&
            styles.activeFilterText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={
    false
  }
  style={{ marginBottom: 20 }}
>
  {categories.map((category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.filterButton,

        selectedCategory ===
          category &&
          styles.activeFilter,
      ]}
      onPress={() =>
        setSelectedCategory(
          category
        )
      }
    >
      <Text
        style={[
          styles.filterText,

          selectedCategory ===
            category &&
            styles.activeFilterText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      {/* TOTAL CARD */}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total Spending
        </Text>

        <Text style={styles.totalAmount}>
          ₹ {totalSpent}
        </Text>
      </View>

      {/* PIE CHART */}

      {pieData.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Category Breakdown
          </Text>

          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: () => '#534AB7',
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute
          />
        </>
      )}

      {/* CATEGORY LIST */}

      <Text style={styles.sectionTitle}>
        Spending by Category
      </Text>

      {Object.entries(categoryTotals).map(
        ([category, amount]) => (
          <View
            key={category}
            style={styles.categoryCard}
          >
            <Text
              style={styles.categoryName}
            >
              {category}
            </Text>

            <Text
              style={styles.categoryAmount}
            >
              ₹ {amount}
            </Text>
          </View>
        )
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

  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C2C2A',
    marginBottom: 20,
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
    color: '#2C2C2A',
    marginBottom: 16,
    marginTop: 20,
  },

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2A',
  },

  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#534AB7',
  },

  filterRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 20,
},

filterButton: {
  backgroundColor: '#EEE',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 16,
  marginRight: 10,
},

activeFilter: {
  backgroundColor: '#534AB7',
},

filterText: {
  fontWeight: '600',
  textTransform: 'capitalize',
},

activeFilterText: {
  color: '#FFF',
},
});