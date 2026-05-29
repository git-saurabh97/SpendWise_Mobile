import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import * as FileSystem from 'expo-file-system/legacy';

import * as Sharing from 'expo-sharing';

import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../stores/useStore';

export default function HistoryScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );

  const [search, setSearch] =
    useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All');

  const categories = [
    'All',

    ...new Set(
      transactions.map(
        (t) =>
          t.category || 'Others'
      )
    ),
  ];

  const filteredTransactions =
    transactions.filter((t) => {
      const matchesSearch =
        t.merchant
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory ===
          'All' ||
        (t.category || 'Others') ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const exportCSV = async (
    range:
      | 'today'
      | 'week'
      | 'month'
      | 'custom'
  ) => {
    let exportTransactions =
      [...filteredTransactions];

    const now = new Date();

    if (range === 'today') {
      exportTransactions =
        exportTransactions.filter(
          (t) => {
            const d = new Date(
              t.timestamp
            );

            return (
              d.toDateString() ===
              now.toDateString()
            );
          }
        );
    }

    if (range === 'week') {
      const weekAgo =
        new Date();

      weekAgo.setDate(
        now.getDate() - 7
      );

      exportTransactions =
        exportTransactions.filter(
          (t) =>
            new Date(
              t.timestamp
            ) >= weekAgo
        );
    }

    if (range === 'month') {
      exportTransactions =
        exportTransactions.filter(
          (t) => {
            const d = new Date(
              t.timestamp
            );

            return (
              d.getMonth() ===
                now.getMonth() &&
              d.getFullYear() ===
                now.getFullYear()
            );
          }
        );
    }

    if (range === 'custom') {
  Alert.prompt?.(
    'Custom Range',
    'Enter number of past days',
    async (days) => {
      if (!days) return;

      const customDays =
        Number(days);

      if (isNaN(customDays)) {
        Alert.alert(
          'Invalid Input',
          'Please enter valid number'
        );

        return;
      }

      const startDate =
        new Date();

      startDate.setDate(
        now.getDate() -
          customDays
      );

      exportTransactions =
        exportTransactions.filter(
          (t) =>
            new Date(
              t.timestamp
            ) >= startDate
        );

      if (
        exportTransactions.length ===
        0
      ) {
        Alert.alert(
          'No Transactions',
          'No transactions found'
        );

        return;
      }

      try {
        const csvHeader =
          'Date,Merchant,Category,Amount,Payment Method\n';

        const csvRows =
          exportTransactions
            .map(
              (t) =>
                `${new Date(
                  t.timestamp
                ).toLocaleDateString()},` +
                `${t.merchant},` +
                `${t.category || 'Others'},` +
                `${t.amount},` +
                `${t.paymentMethod}`
            )
            .join('\n');

        const csvData =
          csvHeader + csvRows;

        const fileUri =
          `${FileSystem.cacheDirectory}SpendWise-Statement.csv`;

        await FileSystem.writeAsStringAsync(
          fileUri,
          csvData,
          {
            encoding:
              FileSystem.EncodingType.UTF8,
          }
        );

        await Sharing.shareAsync(
          fileUri
        );
      } catch {
        Alert.alert(
          'Error',
          'Unable to export statement'
        );
      }
    }
  );

  return;
}

    if (
      exportTransactions.length === 0
    ) {
      Alert.alert(
        'No Transactions',
        'No transactions available for selected period'
      );

      return;
    }

    try {
      const csvHeader =
        'Date,Merchant,Category,Amount,Payment Method\n';

      const csvRows =
        exportTransactions
          .map(
            (t) =>
              `${new Date(
                t.timestamp
              ).toLocaleDateString()},` +
              `${t.merchant},` +
              `${t.category || 'Others'},` +
              `${t.amount},` +
              `${t.paymentMethod}`
          )
          .join('\n');

      const csvData =
        csvHeader + csvRows;

      const fileUri =
        `${FileSystem.cacheDirectory}SpendWise-Statement.csv`;

      await FileSystem.writeAsStringAsync(
        fileUri,
        csvData,
        {
          encoding:
            FileSystem.EncodingType.UTF8,
        }
      );

      await Sharing.shareAsync(
        fileUri
      );
    } catch {
      Alert.alert(
        'Error',
        'Unable to export statement'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      {/* HEADER */}

      <View style={styles.headerRow}>
        <Text style={styles.heading}>
          Transactions
        </Text>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() =>
    Alert.alert(
      'Export Statement',
      'Choose time period for statement export',
      [
        {
          text: 'Today',
          onPress: () =>
            exportCSV('today'),
        },

        {
          text: 'This Week',
          onPress: () =>
            exportCSV('week'),
        },

        {
          text: 'This Month',
          onPress: () =>
            exportCSV('month'),
        },

        {
          text: 'Custom Range',
          onPress: () =>
            exportCSV('custom'),
        },

        {
          text: '✕ Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      }
    )
  }
>
          <Ionicons
            name="download"
            size={18}
            color="#FFFFFF"
          />

          <Text
            style={styles.exportText}
          >
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
        />

        <TextInput
          placeholder="Search merchant"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* CATEGORY FILTER */}

      <Text style={styles.filterTitle}>
        Categories
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={styles.filterRow}
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

      {/* SUMMARY */}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          Total Transactions
        </Text>

        <Text style={styles.summaryValue}>
          {
            filteredTransactions.length
          }
        </Text>
      </View>

      {/* TRANSACTIONS */}

      {filteredTransactions.map(
        (transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.card}
          >
            <View>
              <Text
                style={
                  styles.merchant
                }
              >
                {
                  transaction.merchant
                }
              </Text>

              <Text
                style={styles.meta}
              >
                {transaction.category ||
                  'Others'}{' '}
                •{' '}
                {new Date(
                  transaction.timestamp
                ).toLocaleDateString()}
              </Text>
            </View>

            <Text
              style={
                styles.amount
              }
            >
              ₹ {transaction.amount}
            </Text>
          </TouchableOpacity>
        )
      )}

      {filteredTransactions.length ===
        0 && (
        <Text style={styles.empty}>
          No transactions found
        </Text>
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

  headerRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  exportButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  exportText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '700',
  },

  searchBox: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2C2C2A',
  },

  filterRow: {
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
  },

  activeFilterText: {
    color: '#FFF',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
  },

  summaryLabel: {
    color: '#666',
    fontSize: 15,
  },

  summaryValue: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '700',
    color: '#534AB7',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  merchant: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  meta: {
    marginTop: 4,
    color: '#666',
  },

  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#534AB7',
  },

  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#777',
  },
});