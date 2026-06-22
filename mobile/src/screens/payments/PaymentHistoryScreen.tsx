import { View, FlatList, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePayments } from '../../hooks/usePayment';
import { PaymentCard } from '../../components/payments/PaymentCard';
import { Loading } from '../../components/common/Loading';
import { useAuthStore } from '../../store/authStore';
import { colors, fontSize, spacing } from '../../constants/theme';
import { PaymentStackParamList } from '../../types/navigation';
import { Payment } from '../../types';

type Props = NativeStackScreenProps<PaymentStackParamList, 'PaymentList'>;

export function PaymentHistoryScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isRefetching, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePayments();

  const payments: Payment[] = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return <Loading message="Loading payments..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PaymentDetail', { paymentId: item.id })}
            activeOpacity={0.7}
          >
            <PaymentCard payment={item} currentUserId={user!.id} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💸</Text>
            <Text style={styles.emptyText}>No payments yet</Text>
            <Text style={styles.emptySubtext}>Payments you send and receive will appear here</Text>
          </View>
        }
        ListFooterComponent={isFetchingNextPage ? <Loading message="Loading more..." /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
