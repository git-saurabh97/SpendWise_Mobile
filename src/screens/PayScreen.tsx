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

const quickCategories = [
  'Food',
  'Shopping',
  'Travel',
  'Bills',
  'Entertainment',
  'Others',
];

const paymentMethods = [
  {
    id: 'UPI',
    icon: 'phone-portrait',
  },

  {
    id: 'Card',
    icon: 'card',
  },

  {
    id: 'QR',
    icon: 'qr-code',
  },

  {
    id: 'Cash',
    icon: 'cash',
  },
];

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

  const [cardNumber, setCardNumber] =
  useState('');

  const [bankName, setBankName] =
    useState('');

  const [note, setNote] =
    useState('');

  const [showScanner, setShowScanner] =
    useState(false);

  const [paymentSuccess,
    setPaymentSuccess] =
    useState(false);

  const [
    categoryVisible,
    setCategoryVisible,
  ] = useState(false);

  const [
    currentTransactionId,
    setCurrentTransactionId,
  ] = useState('');

  
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState('UPI');

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert(
        'Missing Amount',
        'Please enter amount'
      );

      return;
    }

    if (
      selectedPaymentMethod ===
        'UPI' &&
      !upiId
    ) {
      Alert.alert(
        'Missing UPI ID',
        'Please enter UPI ID'
      );

      return;
    }

    const transactionId = `txn-${Date.now()}`;

    const transactionData = {
      id: transactionId,

      amount: Number(amount),

      merchant:
        upiId || 'Offline Payment',

      note,

      timestamp:
        new Date().toISOString(),

      paymentMethod:
        selectedPaymentMethod,

      
    };

    try {
      if (
        selectedPaymentMethod ===
        'UPI'
      ) {
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

        await Linking.openURL(
          upiUrl
        );

        setTimeout(() => {
          addTransaction(
            transactionData
          );

          setCurrentTransactionId(
            transactionId
          );

          setPaymentSuccess(true);

          setCategoryVisible(true);
          Alert.alert(
          'Payment Successful',
          `₹ ${amount} payment added successfully`
        );

        setAmount('');
        setUpiId('');
        setNote('');
        }, 2000);
      }

      // addTransaction(
      //   transactionData
      // );

      // setCurrentTransactionId(
      //   transactionId
      // );

      
      
    } catch {
      Alert.alert(
        'Error',
        'Unable to process payment'
      );
    }
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
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <Text style={styles.heading}>
          Pay
        </Text>

        {/* PAYMENT METHODS */}

        <Text style={styles.sectionTitle}>
          Payment Method
        </Text>

        <View style={styles.methodsGrid}>
          {paymentMethods.map(
            (method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,

                  selectedPaymentMethod ===
                    method.id &&
                    styles.activeMethodCard,
                ]}
                onPress={() => {
                  setSelectedPaymentMethod(
                    method.id
                  );

                  if (method.id === 'QR') {
                    setShowScanner(true);
                  }
                }}
              >
                <Ionicons
                  name={
                    method.icon as any
                  }
                  size={28}
                  color={
                    selectedPaymentMethod ===
                    method.id
                      ? '#FFFFFF'
                      : '#534AB7'
                  }
                />

                <Text
                  style={[
                    styles.methodText,

                    selectedPaymentMethod ===
                      method.id &&
                      styles.activeMethodText,
                  ]}
                >
                  {method.id}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* QR

        {selectedPaymentMethod ===
          'QR' && (
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() =>
              setShowScanner(true)
            }
          >
            <Ionicons
              name="qr-code"
              size={22}
              color="#534AB7"
            />

            <Text style={styles.qrText}>
              Scan QR Code
            </Text>
          </TouchableOpacity>
        )} */}

        {/* AMOUNT */}

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

        {/* UPI */}

        {(selectedPaymentMethod ===
          'UPI' || selectedPaymentMethod === 'QR') && (
          <>
            <Text style={styles.label}>
              UPI ID
            </Text>

            <TextInput
              placeholder="name@upi"
              value={upiId}
              onChangeText={setUpiId}
              style={styles.input}
            />
          </>
        )}
        {/* CARD DETAILS */}

        {selectedPaymentMethod ===
          'Card' && (
          <>
            <Text style={styles.label}>
              Bank Name
            </Text>

            <TextInput
              placeholder="HDFC, SBI..."
              value={bankName}
              onChangeText={setBankName}
              style={styles.input}
            />

            <Text style={styles.label}>
              Card Number
            </Text>

            <TextInput
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChangeText={
                setCardNumber
              }
              keyboardType="numeric"
              style={styles.input}
            />
          </>
        )}
        {/* NOTE */}

        <Text style={styles.label}>
          Note
        </Text>

        <TextInput
          placeholder="Add note"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />

        {paymentSuccess && (
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle"
              size={54}
              color="#22C55E"
            />

            <Text style={styles.successTitle}>
              Payment Successful
            </Text>

            <Text style={styles.successSub}>
              Your payment was added
              successfully
            </Text>
          </View>
        )}

        {/* PAY BUTTON */}

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Ionicons
            name="flash"
            size={20}
            color="#FFFFFF"
          />

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
        onSelect={(category) => {
          assignCategory(
            currentTransactionId,
            category
          );

          setCategoryVisible(false);
        }}
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
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 28,
    color: '#2C2C2A',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C2C2A',
  },

  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginBottom: 20,
  },

  methodCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 14,
  },

  activeMethodCard: {
    backgroundColor: '#534AB7',
  },

  methodText: {
    marginTop: 10,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  activeMethodText: {
    color: '#FFFFFF',
  },


  label: {
    marginBottom: 10,
    marginTop: 8,
    fontWeight: '700',
    color: '#2C2C2A',
  },

  amountInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2C2C2A',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    fontSize: 16,
  },

  payButton: {
    backgroundColor: '#534AB7',
    borderRadius: 24,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 10,
  },

  successCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 26,
  paddingVertical: 30,
  alignItems: 'center',
  marginBottom: 24,
},

successTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#2C2C2A',
  marginTop: 14,
},

successSub: {
  marginTop: 8,
  color: '#777',
},

});