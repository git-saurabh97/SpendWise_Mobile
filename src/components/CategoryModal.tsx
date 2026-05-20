import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const categories = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
];

interface Props {
  visible: boolean;

  onClose: () => void;

  onSelect: (
    category: string
  ) => void;
}

export default function CategoryModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            Select Category
          </Text>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.button}
              onPress={() =>
                onSelect(category)
              }
            >
              <Text style={styles.text}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#FFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
  },

  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },

  closeText: {
    color: '#534AB7',
    fontWeight: '700',
  },
});