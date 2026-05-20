import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import { useState } from 'react';

interface Props {
  onClose: () => void;

  onScan: (
    upiId: string,
    merchant: string
  ) => void;
}

export default function QRScannerScreen({
  onClose,
  onScan,
}: Props) {
  const [scanned, setScanned] =
    useState(false);

  const [permission, requestPermission] =
    useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>
          Camera permission needed
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = ({
    data,
  }: {
    data: string;
  }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const url = new URL(data);

      const upiId =
        url.searchParams.get('pa') || '';

      const merchant =
        url.searchParams.get('pn') ||
        'Merchant';

      onScan(upiId, merchant);
    } catch {
      alert('Invalid QR');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleScan}
      />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeText}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },

  closeButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#534AB7',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },

  closeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});