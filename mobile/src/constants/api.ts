import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export const API_URL = __DEV__ ? DEV_API_URL : process.env.EXPO_PUBLIC_API_URL;
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
