import React,{useState,useRef} from 'react';
import {StyleSheet,View,Text,Button,Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function HomeScreen ({navigation:{goBack},navigation}) {
  const[Company_name,setCompany_name] = useState('');
  const[User_name,setUser_name] = useState('');
  const start_scan = () =>{
    navigation.navigate("Scan")
  }
  const logout = () =>{
    goBack();
    AsyncStorage.clear();
  }

  useFocusEffect(
    React.useCallback(() => {
    //ASYNC STORAGE REMOVE ALL PRE-SELECTED ADDITIONS
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            var jsonPars = JSON.parse(store[i][1]);
            if(jsonPars.user_details==1){
              setCompany_name(jsonPars.company_name);
              setUser_name(jsonPars.user_name);
            }else{
            }
          });
        });
    });
      return () => {
      };
    }, [])
  );

return (
  <View style={styles.container}>
    <View style={{flex:0.5,backgroundColor: '#3490DD',flexDirection:'row-reverse',}}>
    <Text style={{alignContent:'center',alignSelf:'center', color:'#ffff',padding:10}} onPress={() =>logout()}>Logout</Text>
    </View>
    <View style={{flex:4,alignItems: 'center',alignContent:'center',justifyContent:'center',backgroundColor:'#14B6D6'}}>
    <Text>{User_name}</Text>
    <Text>{Company_name}</Text>
    <Image
        style={styles.image}
        source={require('../assets/qr_codes.png')}/>
    </View>  
    <View style={{backgroundColor:"#14B6D6"}}>
    <Text onPress={() =>start_scan()} style={{
    backgroundColor:"#ffff",
    color:"#3490DD",
    margin:20,
    padding:15,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius:30,
    textAlign:'center',
    fontSize:18,
    fontWeight:'bold'
    }}>START SCAN</Text>   
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: 'contain'
},
  container: {
    flex: 6,

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