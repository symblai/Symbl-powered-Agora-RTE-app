import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import icons from '../assets/icons';
import SelectDevice from '../subComponents/SelectDevice';
import HostControlView from './HostControlView';
import ColorContext from '../components/ColorContext';

const Settings = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const [screenListActive, setScreenListActive] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {isHost} = props;

  return (
    <>
      <TouchableOpacity
        style={[style.localButton, {borderColor: primaryColor}]}
        disabled={buttonDisabled}
        onPress={() => {
          if (!screenListActive) {
            setScreenListActive(true);
            setButtonDisabled(true);
          }
        }}>
        <Image
          source={{uri: icons.settings}}
          style={[style.buttonIcon, {tintColor: primaryColor}]}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      {screenListActive ? (
        <View style={style.fullOverlay}>
          <View style={style.main}>
            <Text style={style.heading}>Select Input Device</Text>
            <View style={style.popupPickerHolder}>
              <SelectDevice />
            </View>
            {isHost ? <HostControlView /> : <></>}
            <TouchableOpacity
              style={[style.primaryBtn, {backgroundColor: primaryColor}]}
              onPress={() => {
                setScreenListActive(false);
                setButtonDisabled(false);
              }}>
              <Text style={style.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const style = StyleSheet.create({
  fullOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000aa',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    paddingVertical: 5,
    zIndex: 50,
  },
  main: {
    width: '50%',
    height: '80%',
    left: '25%',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    paddingVertical: 5,
    flexDirection: 'column',
  },
  popupPickerHolder: {
    // height: '40%',
    justifyContent: 'space-around',
    paddingHorizontal: '8%',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    tintColor: '#099DFD',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    // marginBottom: 20,
    alignSelf: 'center',
  },
  primaryBtn: {
    width: '60%',
    alignSelf: 'center',
    backgroundColor: '#099DFD',
    maxWidth: 400,
    minHeight: 45,
  },
  primaryBtnText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
  },
  localButton: {
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#099DFD',
    // borderWidth: 1,
    width: 46,
    height: 46,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;
