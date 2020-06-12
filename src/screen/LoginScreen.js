import React,{useState,useRef} from 'react';
import {StyleSheet,View,Text, Button, Alert} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default function LoginScreen ({navigation}) {

  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');

  const setItemStorage = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  const login  = () => {
    if(!user){
      Alert.alert('Please enter username');
    } else if(!password){
      Alert.alert('Please enter password');
    } else {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('password', password);

      fetch('http://192.168.1.175/NotesVerifier_2020/login.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData

      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          var save_response_data = responseJson.response_[0];

          if(save_response_data.status == '1'){
            
            setItemStorage('user_details',{'user_id':save_response_data.user_id,
            'company_code': save_response_data.company_code,
            'company_id': save_response_data.company_id,
            'user_code': save_response_data.user_code,
            'category_id': save_response_data.category_id})

            navigation.navigate("Main");

          } else {
              Alert.alert('User not found');
          }

        }).catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <View style={styles.container}>
      <View style={{width:'75%'}}>
        <TextInput 
                style={{margin:10,borderColor: 'gray',borderWidth: 0.5,borderRadius:10,paddingLeft:20}}
                placeholder='Username'
                onChangeText={text => setUser(text)}
                underlineColorAndroid='#FFF'
        />
        <TextInput 
                style={{margin:10,borderColor: 'gray',borderWidth: 0.5,borderRadius:10,paddingLeft:20}}
                placeholder='Password'
                onChangeText={text => setPassword(text)}
                underlineColorAndroid='#FFF'
        />
        <Button onPress={() =>login()} title="Login" style={{flex:1}}></Button>
      </View>
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