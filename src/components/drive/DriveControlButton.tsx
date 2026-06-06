import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

interface DriveControlButtonProps {
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function DriveControlButton({ isActive, onPress, style }: DriveControlButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isActive, scaleAnim]);

  return (
    <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: isActive ? COLORS.danger : COLORS.success },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.text}>{isActive ? 'END DRIVE' : 'START DRIVE'}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
