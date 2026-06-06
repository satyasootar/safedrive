import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { ActiveDriveScreen } from '../screens/ActiveDriveScreen';
import { DriveResultScreen } from '../screens/DriveResultScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { DriveDetailScreen } from '../screens/DriveDetailScreen';

import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="ActiveDrive" 
          component={ActiveDriveScreen} 
          options={{ gestureEnabled: false, animation: 'fade' }} 
        />
        <Stack.Screen 
          name="DriveResult" 
          component={DriveResultScreen} 
          options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} 
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="DriveDetail" component={DriveDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
