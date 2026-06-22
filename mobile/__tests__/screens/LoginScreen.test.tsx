import React from 'react';
import { render } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/auth/LoginScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('../../src/hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  }),
}));

describe('LoginScreen', () => {
  it('renders sign in title', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Welcome back')).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });
});
