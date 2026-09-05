import { Pressable, StyleSheet, Text, View } from 'react-native';

type NavigationItemProps = {
  icon: string;
  label: string;
};

const NavigationItem = ({icon, label}: NavigationItemProps) => (
  <Pressable accessibilityRole="button" style={styles.navigationItem}>
    <Text style={styles.navigationIcon}>{icon}</Text>
    <Text style={styles.navigationLabel}>{label}</Text>
  </Pressable>
);

function QrIcon() {
  return (
    <View style={styles.qrIcon}>
      <View style={[styles.qrSquare, styles.qrTopLeft]} />
      <View style={[styles.qrSquare, styles.qrTopRight]} />
      <View style={[styles.qrSquare, styles.qrBottomLeft]} />
      <View style={styles.qrDot} />
      <View style={styles.qrLine} />
    </View>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.navigation}>
      <NavigationItem icon="⌂" label="Home" />
      <NavigationItem icon="◉" label="Notifications" />

      <Pressable
        accessibilityLabel="Scan QR code"
        accessibilityRole="button"
        style={styles.scanItem}>
        <View style={styles.scanButton}>
          <QrIcon />
        </View>
        <Text style={styles.scanLabel}>Scan QR</Text>
      </Pressable>

      <NavigationItem icon="⌕" label="Search" />
      <NavigationItem icon="↶" label="History" />
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderTopColor: '#e8edf3',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  navigationItem: {
    alignItems: 'center',
    minWidth: 58,
  },
  navigationIcon: {
    color: '#6d7884',
    fontSize: 24,
    height: 29,
    lineHeight: 26,
  },
  navigationLabel: {
    color: '#6d7884',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
  },
  scanItem: {
    alignItems: 'center',
    minWidth: 64,
    marginTop: -30,
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: '#126acb',
    borderColor: '#ffffff',
    borderRadius: 31,
    borderWidth: 4,
    elevation: 6,
    height: 62,
    justifyContent: 'center',
    shadowColor: '#126acb',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.28,
    shadowRadius: 7,
    width: 62,
  },
  scanLabel: {
    color: '#126acb',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5,
  },
  qrIcon: {
    height: 27,
    position: 'relative',
    width: 27,
  },
  qrSquare: {
    borderColor: '#ffffff',
    borderWidth: 2,
    height: 10,
    position: 'absolute',
    width: 10,
  },
  qrTopLeft: {
    left: 0,
    top: 0,
  },
  qrTopRight: {
    right: 0,
    top: 0,
  },
  qrBottomLeft: {
    bottom: 0,
    left: 0,
  },
  qrDot: {
    backgroundColor: '#ffffff',
    bottom: 2,
    height: 6,
    position: 'absolute',
    right: 2,
    width: 6,
  },
  qrLine: {
    backgroundColor: '#ffffff',
    height: 2,
    left: 11,
    position: 'absolute',
    top: 12,
    width: 7,
  },
});

export default BottomNavigation;
