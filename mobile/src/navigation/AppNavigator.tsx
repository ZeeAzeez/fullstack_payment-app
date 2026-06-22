import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { getToken } from '../utils/storage';
import { getProfile } from '../services/auth';

export function AppNavigator() {
  const { isAuthenticated, isLoading, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (token) {
          const response = await getProfile();
          setAuth(response.data, token);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
