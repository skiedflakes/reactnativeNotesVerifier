'use strict';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Linking,Alert,View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function ScanScreen ({navigation}) {
  const  [Scanner_id, setScanner_id] = useState("");
  const [Amount, setAmount] = useState("");
  const [Date, setDate] = useState("");
  const [Check_num, setCheck_num] = useState("");
  const [Doc_No, setDoc_No] = useState("");

  const onSuccess = e => {
    Alert.alert(e.data);

    check_qr_code_to_db(e.data);
  };
  
  const [company_id, setcompany_id] = useState('');
  const [company_code, setcompany_code] = useState('');

  useFocusEffect(
    React.useCallback(() => {
    //ASYNC STORAGE REMOVE ALL PRE-SELECTED ADDITIONS
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            var jsonPars = JSON.parse(store[i][1]);
            if(jsonPars.user_details==1){
              setcompany_id(jsonPars.company_id);
              setcompany_code(jsonPars.company_code)
            }else{
            }
          });
        });
    });
      return () => {
      };
    }, [])
  );

  const check_qr_code_to_db  = (qr_code) => {
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id',company_id);
    formData.append('qr_code',qr_code);

      fetch(glboal.global_url+'check_qr_to_db2.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }).then((response) => response.json())
        .then((responseJson) => {
          Scanner_id.reactivate();
          var response_data = responseJson.response_[0];
          setAmount(response_data.amount);
          setDate(response_data.check_date);
          setDoc_No(response_data.doc_number);
          setCheck_num(response_data.check_num);
        }).catch((error) => {
          console.error(error);
        });
    }

    return (
      <View style={{flex:1}}>
      <View style={{flex:3}}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.off}
        topContent={
          <Text style={styles.centerText}>
            Go to{''}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        } 
        ref={(node) => {setScanner_id(node)}}
        bottomContent={

          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
      </View>
      <View style={{flex:3, backgroundColor:"white",padding:20}}>
      {/* <Button title="reactivate" onPress={()=>{}}></Button> */}
      <Text>Doc. No. : {Doc_No}</Text>   
      <Text>Date: {Date}</Text>
      <Text>Check No.: {Check_num}</Text>
      <Text>Amount :{Amount}</Text>
      </View> 
      </View>
    );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32, 
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
