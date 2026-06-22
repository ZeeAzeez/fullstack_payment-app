import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SendPaymentScreen } from '../screens/payments/SendPaymentScreen';
import { PaymentHistoryScreen } from '../screens/payments/PaymentHistoryScreen';
import { PaymentDetailScreen } from '../screens/payments/PaymentDetailScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MainTabParamList, PaymentStackParamList } from '../types/navigation';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const PaymentStack = createNativeStackNavigator<PaymentStackParamList>();

function PaymentsNavigator() {
  return (
    <PaymentStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
      }}
    >
      <PaymentStack.Screen
        name="PaymentList"
        component={PaymentHistoryScreen}
        options={{ title: 'Payment History' }}
      />
      <PaymentStack.Screen
        name="PaymentDetail"
        component={PaymentDetailScreen}
        options={{ title: 'Payment Details' }}
      />
    </PaymentStack.Navigator>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="SendPayment"
        component={SendPaymentScreen}
        options={{
          tabBarLabel: 'Send',
          tabBarIcon: ({ color, size }) => <Ionicons name="send" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsNavigator}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
