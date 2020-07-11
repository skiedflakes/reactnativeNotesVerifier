import React,{useState,useEffect,useRef} from 'react';
import {StyleSheet,View, Button, Alert,ActivityIndicator,Image} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function LoginScreen ({navigation}) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  var [Show_loading,setShow_loading] = useState(false); 
  var [Show_view,setShow_view] = useState(false); 
  useFocusEffect(
    React.useCallback(() => {
      setUser('');
      setPassword('');
      retrieveData();  
      return () => retrieveData();
    }, [Show_view,Show_loading])
  );

    const retrieveData = async () => {
      try {
       const valueString = await AsyncStorage.getItem('user_details');
       const value = JSON.parse(valueString);
       if(value==null){
        setShow_loading(false);
        setShow_view(true);
       }else{
        setShow_loading(true);
        setShow_view(false);
        navigation.navigate("Home");
       }
      } 
      catch (error) {
       console.log(error);
      }
     };

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

      fetch(global.global_url+'login.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData

      }).then((response) => response.json())
        .then((responseJson) => {

          var save_response_data = responseJson.response_[0];

          if(save_response_data.status == '1'){
            
            setItemStorage('user_details',{'user_details':1,'user_id':save_response_data.user_id,
            'company_code': save_response_data.company_code,
            'company_id': save_response_data.company_id,
            'user_code': save_response_data.user_code,
            'category_id': save_response_data.category_id,
            'company_name': save_response_data.company_name,
            'user_name': save_response_data.user_name})

            navigation.navigate("Home");

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
   <AntDesign name="stepbackward" size={25} color={"#ffff"} style={{marginLeft:10}}/>
      
      <View style={{width:'75%',marginBottom:60}}>
      <ActivityIndicator size="large" color="#0000ff" animating={Show_loading}/>
      {Show_view && 
      <View>
        <Image
        style={{alignContent:'center',alignSelf:'center',  aspectRatio:0.8, 
        resizeMode: 'contain',}}
        source={require('../assets/qr_logo_icon.jpg')}/>
        <TextInput 
                autoCompleteType="username"
                style={{margin:10,borderColor: 'gray',borderWidth: 0.5,borderRadius:10,paddingLeft:20}}
                placeholder='Username'
                onChangeText={text => setUser(text)}
                underlineColorAndroid='#FFF'
                value={user}
        />
        <TextInput 
          secureTextEntry={true}
                style={{margin:10,borderColor: 'gray',borderWidth: 0.5,borderRadius:10,paddingLeft:20}}
                placeholder='Password'
                onChangeText={text => setPassword(text)}
                underlineColorAndroid='#FFF'
                value={password}
        />
        <Button onPress={() =>login()} title="Login" style={{flex:1}}></Button>
     </View>
     }
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