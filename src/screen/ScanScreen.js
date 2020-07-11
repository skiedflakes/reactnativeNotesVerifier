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
  Linking,Alert,View,Modal,TouchableHighlight
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ScanScreen ({navigation}) {
  const  [Scanner_id, setScanner_id] = useState("");
  const [Amount, setAmount] = useState("");
  const [Date, setDate] = useState("");
  const [Check_num, setCheck_num] = useState("");
  const [Doc_No, setDoc_No] = useState("");
  const [Status, setStatus] = useState("");
  const [NetworkStatus, setNetworkStatus] = useState("");
  //views
  const [ShowView,setShowView] =useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const onSuccess = e => {
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
    setShowView(false)
      return () => {
      };
    }, [])
  );

  const  scanner_reactivate  = () => {Scanner_id.reactivate();}

  const check_qr_code_to_db  = (qr_code) => {
    setShowView(false);
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id',company_id);
    formData.append('qr_code',qr_code);

      fetch(global.global_url+'check_qr_to_db2.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }).then((response) => response.json())
        .then((responseJson) => {
         

         
          var response_data = responseJson.response_[0];
          set_modal_visibile_with_status(1);
          if(response_data.status>0){
            setShowView(true); //show view
            setAmount(response_data.amount);
            setDate(response_data.check_date);
            setDoc_No(response_data.doc_number);
            setCheck_num(response_data.check_num);
            setStatus(response_data.status);
          }else{
            setShowView(false); //show view
            setStatus(response_data.status);
          }

      
        }).catch((error) => {
          console.error(error);
          set_modal_visibile_with_status(0);
        });
    }

    const set_modal_visibile_with_status = (network_status) => {
      setNetworkStatus(network_status);
      setModalVisible(true);
    }

    return (

    <View style={styles.main}>
     <Success_modal visbiility={modalVisible} const_state={setModalVisible} status={Status} network_status ={NetworkStatus}  scanner={scanner_reactivate}/>
      <View style={{flex:1,}}>
      <View style={{flex:3}}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.off}
        ref={(node) => {setScanner_id(node)}}
        bottomContent={

          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
      </View>
      <View style={{flex:3, backgroundColor:"white",padding:20}}>
      {/* <Button title="test scan" onPress={()=>{check_qr_code_to_db('RFR-124-06152016051')}}></Button> */}
      <Button title="test modal" onPress={()=>{setModalVisible(true)}}></Button>
      {ShowView &&
      <View>
      <Text>{Doc_No}</Text>   
      <Text>Date: {Date}</Text>
      <Text>Check No.: {Check_num}</Text>
      <Text>Amount :{Amount}</Text>
      </View>
      }
      </View> 
      </View>
      </View>
    );
}

function Success_modal({visbiility,const_state,status,scanner,network_status}) {
  return( 
   <Modal
    animationType="fade"
    transparent={true}
    visible={visbiility}
    >
      <View style={styles.centeredView}>
          <View style={styles.modalView}>
      <View style={{flexDirection:"column-reverse",height: 100,width:250}}>
      <View style={{flexDirection:"row"}}>
 
      <View style={{flex:1,flexDirection:"column"}}>
      <Text style={styles.textBold}>{network_status}</Text>
      <Text style={styles.textBold}>{status}</Text>

      {network_status>0?status>0?
      <Text style={styles.status_text}><AntDesign name="checkcircleo" color={'#1FC80A'} size={20}/> Scan Success</Text>
      :<Text style={styles.status_text}><AntDesign name="exclamationcircle" size={20}/> QR not found</Text>
      :<Text style={styles.status_text}><AntDesign name="exclamationcircle" size={20}/>  Error Network Connection</Text>}

      <TouchableHighlight
          style={{...styles.openButton, backgroundColor: "#787878",marginTop:10}}
          onPress={() => {
            const_state(!visbiility);
            scanner();
          }}>   
      <Text style={styles.textStyle}>OK</Text>
      </TouchableHighlight>
      </View>
      </View>
      </View>
      </View>
      </View>
    </Modal>
  )}

const styles = StyleSheet.create({
  main:{
    alignItems:"center",
    alignContent:"center",
    alignSelf:"center",
    flex:6,
    backgroundColor: '#ffff',
    alignContent:"center",
    flexDirection:'column'
},
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
  },modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modal_centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  }, 
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  status_text:{
    justifyContent:"center",
    fontSize:15,
    padding:10,
    // backgroundColor:"#FF5733",
    alignContent:"center",
    alignSelf:"center",
  }
});
