import React, { useState, useEffect,Alert} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import ScanScreen from './src/screen/ScanScreen';
const Stack = createStackNavigator();
import AsyncStorage from '@react-native-community/async-storage';
function App() {
    useEffect(() => {
      global.global_url = 'https://mobile.wdysolutions.com/notes_verifier/main/';
    });
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Scan" component={ScanScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
}
export default App;
