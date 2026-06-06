import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VehicleType } from '../../types';
import { COLORS } from '../../constants/theme';

interface VehicleAnimationProps {
  vehicleType: VehicleType;
  isHalted: boolean;
}

const { width } = Dimensions.get('window');

export function VehicleAnimation({ vehicleType, isHalted }: VehicleAnimationProps) {
  const roadAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const windAnim1 = useRef(new Animated.Value(0)).current;
  const windAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Road moving animation
    const roadLoop = Animated.loop(
      Animated.timing(roadAnim, {
        toValue: -100,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Vehicle bounce animation
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -4,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // Wind lines animation
    const windLoop1 = Animated.loop(
      Animated.timing(windAnim1, {
        toValue: -width - 200,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const windLoop2 = Animated.loop(
      Animated.timing(windAnim2, {
        toValue: -width - 200,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    if (isHalted) {
      roadLoop.stop();
      bounceLoop.stop();
      windLoop1.stop();
      windLoop2.stop();
      
      // Reset positions to 0 when halted
      Animated.spring(bounceAnim, { toValue: 0, useNativeDriver: true }).start();
    } else {
      roadLoop.start();
      bounceLoop.start();
      windLoop1.start();
      windLoop2.start();
    }

    return () => {
      roadLoop.stop();
      bounceLoop.stop();
      windLoop1.stop();
      windLoop2.stop();
    };
  }, [isHalted, roadAnim, bounceAnim, windAnim1, windAnim2]);

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'CAR': return 'car-side';
      case 'MOTORCYCLE': return 'motorbike';
      case 'BICYCLE': return 'bicycle';
      default: return 'car-side';
    }
  };

  const getVehicleSize = () => {
    switch (vehicleType) {
      case 'CAR': return 80;
      case 'MOTORCYCLE': return 70;
      case 'BICYCLE': return 65;
      default: return 80;
    }
  };

  // Create repeating road lines
  const renderRoadLines = () => {
    const lines = [];
    const numberOfLines = Math.ceil(width / 100) + 2;
    for (let i = 0; i < numberOfLines; i++) {
      lines.push(<View key={i} style={[styles.roadDash, { left: i * 100 }]} />);
    }
    return lines;
  };

  return (
    <View style={styles.container}>
      {/* Wind Lines (Background) */}
      <Animated.View style={[styles.windLine, { top: 20, transform: [{ translateX: windAnim1 }] }]} />
      <Animated.View style={[styles.windLine, { top: 60, width: 60, opacity: 0.3, transform: [{ translateX: windAnim2 }] }]} />

      {/* Vehicle */}
      <Animated.View style={[styles.vehicleWrapper, { transform: [{ translateY: bounceAnim }] }]}>
        <MaterialCommunityIcons 
          name={getVehicleIcon()} 
          size={getVehicleSize()} 
          color={COLORS.primary} 
          style={styles.shadow} 
        />
      </Animated.View>

      {/* Road */}
      <View style={styles.roadContainer}>
        <Animated.View style={[styles.roadMoving, { transform: [{ translateX: roadAnim }] }]}>
          {renderRoadLines()}
        </Animated.View>
        <View style={styles.roadSolid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.surface,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  windLine: {
    position: 'absolute',
    right: -100, // start off-screen right
    width: 100,
    height: 2,
    backgroundColor: COLORS.primaryDim,
    borderRadius: 2,
    opacity: 0.5,
  },
  vehicleWrapper: {
    marginBottom: 10,
    zIndex: 10,
  },
  shadow: {
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  roadContainer: {
    width: '100%',
    height: 15,
    position: 'absolute',
    bottom: 0,
    overflow: 'visible',
  },
  roadSolid: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 6,
    backgroundColor: COLORS.cardBorder,
  },
  roadMoving: {
    width: '100%',
    height: 3,
    position: 'absolute',
    bottom: 6,
  },
  roadDash: {
    position: 'absolute',
    width: 40,
    height: 3,
    backgroundColor: COLORS.primaryDim,
    borderRadius: 2,
  },
});
