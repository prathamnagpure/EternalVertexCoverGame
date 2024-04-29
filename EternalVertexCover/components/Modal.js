import {Modal} from 'react-native';
import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';

export default function MyModal({
  text,
  modalVisible,
  onClickNext,
  x,
  y,
  goBack,
  buttonText,
  showAns,
  challengeMe,
  width,
}) {
  const [darknes, setDarkness] = useState({});
  return (
    // <View style={[styles.centeredView, {top: y, left: x}]}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        goBack();
      }}>
      <View style={[styles.centeredView, darknes]}>
        <View
          style={[
            styles.modalView,
            {top: y, left: x},
            {width: width ?? 'auto'},
          ]}>
          <Text style={[styles.modalText]}>{text}</Text>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => onClickNext()}>
            <Text style={styles.textStyle}>{buttonText ?? 'Next'}</Text>
          </Pressable>
          {showAns && (
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                showAns();
                setDarkness({backgroundColor: 'rgba(0,0,0,0.3)'});
              }}>
              <Text style={styles.textStyle}>Show Answer!</Text>
            </Pressable>
          )}
          {challengeMe && (
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setDarkness({backgroundColor: 'rgba(0,0,0,0.3)'});
                challengeMe();
              }}>
              <Text style={styles.textStyle}>Challenge Me!</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
    // </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,

    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',

    // borderColor: 'black',
    // borderWidth: 20,
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    borderRadius: 20,
    padding: 10,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});
