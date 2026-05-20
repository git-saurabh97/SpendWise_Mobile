import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import * as Linking from 'expo-linking';

import { useState } from 'react';
import QRScannerScreen from './QRScannerScreen';

import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../stores/useStore';

import CategoryModal from '../components/CategoryModal';

export default function PayScreen() {
  const addTransaction = useStore(
    (s) => s.addTransaction
  );

  const assignCategory = useStore(
    (s) => s.assignCategory
  );

  const [amount, setAmount] =
    useState('');

  const [upiId, setUpiId] =
    useState('');

  const [note, setNote] =
    useState('');

  const [showScanner, setShowScanner] =
    useState(false);

  const [
    categoryVisible,
    setCategoryVisible,
  ] = useState(false);

  const [
    currentTransactionId,
    setCurrentTransactionId,
  ] = useState('');

  const handlePayment = async () => {
    if (!amount || !upiId) {
      Alert.alert(
        'Missing Details',
        'Please enter amount and UPI ID'
      );

      return;
    }

    const transactionId = `txn-${Date.now()}`;

    const upiUrl =
      `upi://pay?` +
      `pa=${encodeURIComponent(
        upiId
      )}` +
      `&pn=${encodeURIComponent(
        'SpendWise'
      )}` +
      `&am=${amount}` +
      `&cu=INR`;

    try {
      const supported =
        await Linking.canOpenURL(
          upiUrl
        );

      if (!supported) {
        Alert.alert(
          'Error',
          'No UPI app found'
        );

        return;
      }

      await Linking.openURL(upiUrl);

      addTransaction({
        id: transactionId,
        amount: Number(amount),
        merchant: upiId,
        note,
        timestamp:
          new Date().toISOString(),
        paymentMethod: 'UPI',
      });

      setCurrentTransactionId(
        transactionId
      );

      setCategoryVisible(true);
    } catch {
      Alert.alert(
        'Error',
        'Unable to open UPI app'
      );
    }
  };

  const handleCategorySelect = (
    category: string
  ) => {
    assignCategory(
      currentTransactionId,
      category
    );

    setCategoryVisible(false);
  };
  if (showScanner) {
  return (
    <QRScannerScreen
      onClose={() =>
        setShowScanner(false)
      }
      onScan={(
        scannedUpiId,
        merchant
      ) => {
        setUpiId(scannedUpiId);

        setNote(merchant);

        setShowScanner(false);
      }}
    />
  );
}
  return (
    <>
      <ScrollView
        style={styles.container}
      >
        <Text style={styles.heading}>
          Pay
        </Text>

        <View style={styles.methodsRow}>
          <TouchableOpacity
            style={styles.methodCard}
          >
            <Ionicons
              name="phone-portrait"
              size={26}
              color="#534AB7"
            />

            <Text
              style={styles.methodText}
            >
              UPI ID
            </Text>
           </TouchableOpacity>

          {/*<TouchableOpacity
            style={styles.methodCard}
          >
            <Ionicons
              name="qr-code"
              size={26}
              color="#534AB7"
            />

            <Text
              style={styles.methodText}
            >
              QR Scan
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() =>
                setShowScanner(true)
            }
            >
            <Ionicons
                name="qr-code"
                size={26}
                color="#534AB7"
            />

            <Text style={styles.methodText}>
                QR Scan
            </Text>
           </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          placeholder="₹ 0"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.amountInput}
        />

        <Text style={styles.label}>
          UPI ID
        </Text>

        <TextInput
          placeholder="name@upi"
          value={upiId}
          onChangeText={setUpiId}
          style={styles.input}
        />

        <Text style={styles.label}>
          Note
        </Text>

        <TextInput
          placeholder="Add note"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text
            style={styles.payButtonText}
          >
            Pay Now
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CategoryModal
        visible={categoryVisible}
        onClose={() =>
          setCategoryVisible(false)
        }
        onSelect={
          handleCategorySelect
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
  },

  methodsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 30,
  },

  methodCard: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 24,
    borderRadius: 18,
    alignItems: 'center',
  },

  methodText: {
    marginTop: 10,
    fontWeight: '600',
  },

  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '600',
  },

  amountInput: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    fontSize: 32,
    fontWeight: '700',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },

  payButton: {
    marginTop: 40,
    backgroundColor: '#534AB7',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  payButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
});