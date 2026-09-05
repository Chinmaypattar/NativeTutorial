import { StyleSheet, Text, View } from 'react-native';
import BottomNavigation from './BottomNavigation';
import FloatingChatButton from './FloatingChatButton';

type FinancialDashboardProps = {
  onOpenChat: () => void;
};

const actions = [
  { icon: '⇄', label: 'Fund\nTransfer' },
  { icon: '▣', label: 'Pay Bills' },
  { icon: '▯', label: 'Recharge' },
  { icon: '•••', label: 'More' },
];

function FinancialDashboard({ onOpenChat }: FinancialDashboardProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning, Pranita ✨</Text>
          <Text style={styles.sectionTitle}>Accounts</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Available Balance</Text>
          <Text style={styles.balance}>₹2,45,680.50</Text>
        </View>
      </View>
      <View style={styles.accountsCard}>
        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountName}>Savings Account</Text>
            <Text style={styles.accountNumber}>••••••••••</Text>
          </View>
          <Text style={styles.accountAmount}>₹1,85,430.00</Text>
        </View>

        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountName}>Credit Card</Text>
            <Text style={styles.accountNumber}>••••••••••</Text>
          </View>
          <Text style={styles.accountAmount}>₹60,250.50</Text>
        </View>
      </View>

      <View style={styles.actionsArea}>
        <View style={styles.actionsRow}>
          {actions.map(action => (
            <View key={action.label} style={styles.action}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomNavigation />
      <FloatingChatButton onPress={onOpenChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:'white'
  },
  screenHeader: {
    // flex: 1,
    backgroundColor: '#08244b',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
  },
  greeting: {
    color: '#f2f7ff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#f2f7ff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
  },
  balanceCard: {
    backgroundColor: '#0659b1',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginHorizontal: 16,
    paddingHorizontal: 22,
    paddingVertical: 22,
    shadowColor: '#075bb4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceLabel: {
    color: '#c5e0ff',
    fontSize: 12,
  },
  balance: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 10,
  },
  accountsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 14,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#0f3154',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountRow: {
    alignItems: 'center',
    borderBottomColor: '#edf1f5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 16,
  },
  actionsArea: {
    backgroundColor: '#ffffff',
    flex: 1,
    marginTop: -1,
  },
  accountName: {
    color: '#4d5865',
    fontSize: 12,
    fontWeight: '600',
  },
  accountNumber: {
    color: '#a3abb3',
    fontSize: 11,
    marginTop: 5,
  },
  accountAmount: {
    color: '#36404b',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    paddingTop: 25,
  },
  action: {
    alignItems: 'center',
    width: 78,
  },
  actionIconCircle: {
    alignItems: 'center',
    borderColor: '#77828d',
    borderRadius: 12,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  actionIcon: {
    color: '#69747f',
    fontSize: 17,
    fontWeight: '600',
  },
  actionLabel: {
    color: '#303a45',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 9,
    textAlign: 'center',
  },
});

export default FinancialDashboard;
