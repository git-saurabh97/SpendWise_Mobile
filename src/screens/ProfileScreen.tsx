import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';

import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../stores/useStore';

export default function ProfileScreen() {
  const monthlyBudget = useStore(
    (s) => s.monthlyBudget
  );

  const setMonthlyBudget =
    useStore(
      (s) => s.setMonthlyBudget
    );

  const transactions = useStore(
    (s) => s.transactions
  );

  const [budget, setBudget] =
    useState(
      monthlyBudget.toString()
    );

  const [notificationsEnabled,
    setNotificationsEnabled] =
    useState(true);

  const totalSpent =
    transactions.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const remainingBudget =
    monthlyBudget - totalSpent;

  const budgetUsed =
    monthlyBudget > 0
      ? (
          (totalSpent /
            monthlyBudget) *
          100
        ).toFixed(0)
      : '0';

  const saveBudget = () => {
    if (!budget) {
      Alert.alert(
        'Error',
        'Please enter budget'
      );

      return;
    }

    setMonthlyBudget(
      Number(budget)
    );

    Alert.alert(
      'Success',
      'Budget Updated'
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      <Text style={styles.heading}>
        Profile
      </Text>

      {/* USER CARD */}

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={42}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.userName}>
          Saurabh
        </Text>

        <Text style={styles.userEmail}>
          SpendWise User
        </Text>
      </View>

      {/* BUDGET CARD */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Monthly Budget
        </Text>

        <TextInput
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholder="Enter Budget"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={saveBudget}
        >
          <Text
            style={styles.buttonText}
          >
            Save Budget
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <View style={styles.analyticsRow}>
        <View style={styles.analyticsCard}>
          <Text
            style={styles.analyticsLabel}
          >
            Total Spent
          </Text>

          <Text
            style={styles.analyticsValue}
          >
            ₹ {totalSpent}
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text
            style={styles.analyticsLabel}
          >
            Remaining
          </Text>

          <Text
            style={styles.analyticsValue}
          >
            ₹ {remainingBudget}
          </Text>
        </View>
      </View>

      {/* BUDGET PROGRESS */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Budget Usage
        </Text>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(
                  Number(budgetUsed),
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {budgetUsed}% used
        </Text>
      </View>

      {/* BUDGET STATUS */}

<View style={styles.card}>
  <Text style={styles.cardTitle}>
    Budget Status
  </Text>

  <View style={styles.budgetRow}>
    <Text style={styles.budgetLabel}>
      Monthly Budget
    </Text>

    <Text style={styles.budgetValue}>
      ₹ {monthlyBudget}
    </Text>
  </View>

  <View style={styles.budgetRow}>
    <Text style={styles.budgetLabel}>
      Total Spent
    </Text>

    <Text style={styles.budgetValue}>
      ₹ {totalSpent}
    </Text>
  </View>

  <View style={styles.budgetRow}>
    <Text style={styles.budgetLabel}>
      Remaining
    </Text>

    <Text
      style={[
        styles.budgetValue,
        {
          color:
            remainingBudget < 0
              ? 'red'
              : '#534AB7',
        },
      ]}
    >
      ₹ {remainingBudget}
    </Text>
  </View>
</View>

      {/* SETTINGS */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Preferences
        </Text>

        <View style={styles.settingRow}>
          <View
            style={styles.settingLeft}
          >
            <Ionicons
              name="notifications"
              size={22}
              color="#534AB7"
            />

            <Text
              style={styles.settingText}
            >
              Notifications
            </Text>
          </View>

          <Switch
            value={
              notificationsEnabled
            }
            onValueChange={
              setNotificationsEnabled
            }
          />
        </View>

        <View style={styles.settingRow}>
          <View
            style={styles.settingLeft}
          >
            <Ionicons
              name="shield-checkmark"
              size={22}
              color="#534AB7"
            />

            <Text
              style={styles.settingText}
            >
              Secure Payments
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={22}
            color="green"
          />
        </View>
      </View>

      {/* APP INFO */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          About
        </Text>

        <Text style={styles.aboutText}>
          SpendWise helps you
          track spending, manage
          budget, and analyze
          expenses smarter.
        </Text>

        <Text style={styles.version}>
          Version 1.0.0
        </Text>
      </View>
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

  userCard: {
    backgroundColor: '#534AB7',
    borderRadius: 28,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor:
      'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  userEmail: {
    color: '#D9D6FF',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C2C2A',
  },

  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#534AB7',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  analyticsRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 20,
  },

  analyticsCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },

  analyticsLabel: {
    color: '#777',
    fontSize: 14,
  },

  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    color: '#534AB7',
  },

  progressBarBg: {
    height: 14,
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#534AB7',
    borderRadius: 10,
  },

  progressText: {
    marginTop: 12,
    fontWeight: '600',
    color: '#555',
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2A',
  },

  aboutText: {
    color: '#666',
    lineHeight: 22,
  },

  version: {
    marginTop: 16,
    color: '#999',
    fontSize: 13,
  },

  budgetRow: {
  flexDirection: 'row',
  justifyContent:
    'space-between',
  alignItems: 'center',
  marginBottom: 16,
},

budgetLabel: {
  fontSize: 16,
  color: '#555',
},

budgetValue: {
  fontSize: 18,
  fontWeight: '700',
  color: '#534AB7',
},

});