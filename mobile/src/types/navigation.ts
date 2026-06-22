import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type PaymentStackParamList = {
  PaymentList: undefined;
  PaymentDetail: { paymentId: string };
};

export type MainTabParamList = {
  SendPayment: undefined;
  PaymentsTab: NavigatorScreenParams<PaymentStackParamList>;
  Profile: undefined;
};
