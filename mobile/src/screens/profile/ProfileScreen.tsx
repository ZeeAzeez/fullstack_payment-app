import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAuthStore } from '../../store/authStore';
import { useLogout, useTopup } from '../../hooks/useAuth';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';
import { formatCurrency } from '../../utils/format';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const topup = useTopup();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleTopup = () => {
    Alert.prompt(
      'Add Funds',
      'Enter amount in USD (e.g. 100 for $100.00):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const dollars = parseFloat(value || '0');
            if (isNaN(dollars) || dollars <= 0) {
              Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
              return;
            }
            topup.mutate(Math.round(dollars * 100));
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad',
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(user?.balance ?? 0)}</Text>
        <Button
          title={topup.isPending ? 'Adding...' : '+ Add Funds'}
          variant="outline"
          onPress={handleTopup}
          loading={topup.isPending}
          style={styles.topupButton}
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoLabel}>Member since</Text>
        <Text style={styles.infoValue}>
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '—'}
        </Text>
      </Card>

      <Button title="Logout" variant="outline" onPress={handleLogout} style={styles.logoutButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 80,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  balanceCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  topupButton: {
    width: '100%',
  },
  infoCard: {
    marginBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: spacing.xl,
  },
});
