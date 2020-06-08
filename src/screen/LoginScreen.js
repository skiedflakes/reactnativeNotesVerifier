import React,{useState,useRef} from 'react';
import {StyleSheet,View,Text, Button, Alert} from "react-native";
import { TextInput } from 'react-native-gesture-handler';


export default function LoginScreen ({navigation}) {
  const login  = () => {
    navigation.navigate("Main");
  }
return (
  <View style={styles.container}>
    <View></View>
     <TextInput> Username</TextInput>
     <TextInput hin> Password</TextInput>
     <Button onPress={() =>login()} title="Login" style={{flex:1}}></Button>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginVertical: 8,
  },
  direct: {
    backgroundColor: '#db7d35',
  },
  stripe: {
    backgroundColor: '#556cd6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
})