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
  LineChart,
} from 'react-native-chart-kit';

import { useState } from 'react';

import { useStore } from '../stores/useStore';

const screenWidth =
  Dimensions.get('window').width;

export default function InsightsScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );

  const monthlyBudget = useStore(
    (s) => s.monthlyBudget
  );

  const [filter, setFilter] =
    useState<
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'quarterly'
    >('monthly');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All');

  const now = new Date();

  /* FILTER BY DATE */

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

  /* CATEGORY FILTERS */

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
          (t.category ||
            'Others') ===
          selectedCategory
        );
      }
    );

  /* TOTAL SPENT */

  const totalSpent =
    finalTransactions.reduce(
      (sum, t) =>
        sum + t.amount,
      0
    );

  /* BUDGET */

  const budgetUsed =
    monthlyBudget > 0
      ? (totalSpent /
          monthlyBudget) *
        100
      : 0;

  const remaining =
    monthlyBudget - totalSpent;

  /* CATEGORY TOTALS */

  const categoryTotals: Record<
    string,
    number
  > = {};

  finalTransactions.forEach((t) => {
    const category =
      t.category || 'Others';

    categoryTotals[category] =
      (categoryTotals[
        category
      ] || 0) + t.amount;
  });

  /* ANALYTICS */

  const dailyAverage =
    finalTransactions.length > 0
      ? (
          totalSpent /
          finalTransactions.length
        ).toFixed(2)
      : 0;

  const biggestExpense =
    finalTransactions.reduce(
      (max, t) =>
        t.amount > max.amount
          ? t
          : max,
      {
        amount: 0,
        merchant: '',
      } as any
    );

  const merchantTotals: Record<
    string,
    number
  > = {};

  finalTransactions.forEach((t) => {
    merchantTotals[
      t.merchant
    ] =
      (merchantTotals[
        t.merchant
      ] || 0) + t.amount;
  });

  const topMerchant =
    Object.entries(
      merchantTotals
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

  const topCategory =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

  /* LINE CHART */

  const trendData =
    finalTransactions
      .slice(0, 7)
      .reverse();

  const lineChartData = {
    labels: trendData.map(
      (_, index) =>
        `${index + 1}`
    ),

    datasets: [
      {
        data:
          trendData.length > 0
            ? trendData.map(
                (t) =>
                  t.amount
              )
            : [0],
      },
    ],
  };

  /* PIE CHART */

  const pieData = Object.entries(
    categoryTotals
  ).map(
    (
      [category, amount],
      index
    ) => ({
      name: category,

      population: amount,

      color: [
        '#534AB7',
        '#7B6EF6',
        '#A393FF',
        '#D1C7FF',
        '#8B80F9',
        '#C6BAFF',
      ][index % 6],

      legendFontColor:
        '#333',

      legendFontSize: 14,
    })
  );

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

      {/* FILTERS */}

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
              setFilter(
                item as any
              )
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

      {/* CATEGORY FILTER */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={{
          marginBottom: 20,
        }}
      >
        {categories.map(
          (category) => (
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
          )
        )}
      </ScrollView>

      {/* TOTAL CARD */}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total Spending
        </Text>

        <Text
          style={styles.totalAmount}
        >
          ₹ {totalSpent}
        </Text>
      </View>

      {/* BUDGET CARD */}

      <View style={styles.budgetCard}>
        <View
          style={styles.budgetRow}
        >
          <Text
            style={styles.budgetTitle}
          >
            Monthly Budget
          </Text>

          <Text
            style={styles.budgetAmount}
          >
            ₹ {monthlyBudget}
          </Text>
        </View>

        <View
          style={styles.progressBg}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  budgetUsed,
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <View
          style={styles.budgetRow}
        >
          <Text
            style={styles.remaining}
          >
            Remaining:
            ₹ {remaining}
          </Text>

          <Text
            style={styles.remaining}
          >
            {budgetUsed.toFixed(
              0
            )}
            %
          </Text>
        </View>
      </View>

      {/* ANALYTICS */}

      <View
        style={styles.analyticsGrid}
      >
        <View
          style={styles.analyticsCard}
        >
          <Text
            style={
              styles.analyticsLabel
            }
          >
            Daily Avg
          </Text>

          <Text
            style={
              styles.analyticsValue
            }
          >
            ₹ {dailyAverage}
          </Text>
        </View>

        <View
          style={styles.analyticsCard}
        >
          <Text
            style={
              styles.analyticsLabel
            }
          >
            Biggest Expense
          </Text>

          <Text
            style={
              styles.analyticsValue
            }
          >
            ₹{' '}
            {
              biggestExpense.amount
            }
          </Text>

          <Text
            style={
              styles.analyticsSub
            }
          >
            {
              biggestExpense.merchant
            }
          </Text>
        </View>

        <View
          style={styles.analyticsCard}
        >
          <Text
            style={
              styles.analyticsLabel
            }
          >
            Top Category
          </Text>

          <Text
            style={
              styles.analyticsValue
            }
          >
            {topCategory?.[0] ||
              '-'}
          </Text>
        </View>

        <View
          style={styles.analyticsCard}
        >
          <Text
            style={
              styles.analyticsLabel
            }
          >
            Top Merchant
          </Text>

          <Text
            style={
              styles.analyticsValue
            }
          >
            {topMerchant?.[0] ||
              '-'}
          </Text>
        </View>
      </View>

      {/* LINE CHART */}

      {finalTransactions.length >
        0 && (
        <>
          <Text
            style={
              styles.sectionTitle
            }
          >
            Spending Trend
          </Text>

          <LineChart
            data={lineChartData}
            width={
              screenWidth - 40
            }
            height={220}
            chartConfig={{
              backgroundGradientFrom:
                '#FFFFFF',

              backgroundGradientTo:
                '#FFFFFF',

              decimalPlaces: 0,

              color: (
                opacity = 1
              ) =>
                `rgba(83,74,183,${opacity})`,

              labelColor:
                () => '#555',
            }}
            bezier
            style={{
              borderRadius: 20,
            }}
          />
        </>
      )}

      {/* PIE CHART */}

      {pieData.length > 0 && (
        <>
          <Text
            style={
              styles.sectionTitle
            }
          >
            Category Breakdown
          </Text>

          <PieChart
            data={pieData}
            width={
              screenWidth - 40
            }
            height={220}
            chartConfig={{
              color: () =>
                '#534AB7',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute
          />
        </>
      )}

      {/* CATEGORY LIST */}

      <Text
        style={styles.sectionTitle}
      >
        Spending by Category
      </Text>

      {Object.entries(
        categoryTotals
      ).map(
        ([category, amount]) => (
          <View
            key={category}
            style={
              styles.categoryCard
            }
          >
            <Text
              style={
                styles.categoryName
              }
            >
              {category}
            </Text>

            <Text
              style={
                styles.categoryAmount
              }
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
    textTransform:
      'capitalize',
  },

  activeFilterText: {
    color: '#FFF',
  },

  totalCard: {
    backgroundColor: '#534AB7',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
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

  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },

  budgetRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  budgetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  budgetAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#534AB7',
  },

  progressBg: {
    height: 14,
    backgroundColor: '#EEE',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#534AB7',
  },

  remaining: {
    color: '#666',
    fontWeight: '600',
  },

  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginBottom: 20,
  },

  analyticsCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  analyticsLabel: {
    color: '#777',
    fontSize: 13,
  },

  analyticsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2C2A',
    marginTop: 8,
  },

  analyticsSub: {
    marginTop: 4,
    color: '#777',
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
    justifyContent:
      'space-between',
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
});