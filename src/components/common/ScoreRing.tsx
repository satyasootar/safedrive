import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../../constants/theme';
import { SafetyRating } from '../../types';
import { ScoreService } from '../../services/ScoreService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

export function ScoreRing({ score, size = 160, strokeWidth = 14, animate = true }: ScoreRingProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animate) {
      Animated.spring(animatedValue, {
        toValue: score,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }).start();
    } else {
      animatedValue.setValue(score);
    }
  }, [score, animate, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const rating: SafetyRating = ScoreService.getSafetyRating(score);
  const color = COLORS.ratingColors[rating];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.cardBorder}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.centerContent]}>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
        <Text style={styles.label}>SCORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: FONTS.sizes.hero,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
