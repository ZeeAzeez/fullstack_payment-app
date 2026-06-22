import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

registerRootComponent(App);
