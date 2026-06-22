import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/common/Button';

describe('Button', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<Button title="Send" onPress={() => {}} />);
    expect(getByText('Send')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Send" onPress={onPress} />);
    fireEvent.press(getByText('Send'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Send" onPress={onPress} disabled />);
    fireEvent.press(getByText('Send'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
