import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import ScanScreen from './src/screen/ScanScreen';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {/* <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }}/> */}
      <Stack.Screen name="Login" component={LoginScreen}options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Scan" component={ScanScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
