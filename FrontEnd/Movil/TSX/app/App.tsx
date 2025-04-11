import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Register from './frontend/views/auth/Register';
import Login from './frontend/views/auth/Login';
import Home from './frontend/views/home/Home';
import { enableScreens } from 'react-native-screens';
import { enableFreeze } from 'react-native-screens';

enableScreens(true);
enableFreeze(true);
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="register" component={Register}/>
        <Stack.Screen name="login" component={Login}/>
        <Stack.Screen name="home" component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
