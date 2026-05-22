import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../stores/useStore';

export default function HistoryScreen() {
  const transactions = useStore(
    (s) => s.transactions
  );
  console.log(
  'TRANSACTIONS:',
  transactions
);

  const [search, setSearch] =
    useState('');

  const [selectedCategory,
    setSelectedCategory] =
    useState('All');

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      <Text style={styles.heading}>
        Transactions
      </Text>

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={styles.filterRow}
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

      {/* TRANSACTION LIST */}

      {filteredTransactions.map(
        (transaction) => (
        <TouchableOpacity
         key={transaction.id}
         style={styles.card}
         onPress={() =>
          router.push({
           pathname:
            '/transaction/[id]',
           params: {
            id: transaction.id,
      },
    })
  }
>
            <View>
              <Text
                style={styles.merchant}
              >
                {
                  transaction.merchant
                }
              </Text>

              <Text style={styles.meta}>
                {
                  transaction.category
                }{' '}
                •{' '}
                {new Date(
                  transaction.timestamp
                ).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.amount}>
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

  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    color: '#2C2C2A',
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

  filterRow: {
    marginBottom: 24,
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

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
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