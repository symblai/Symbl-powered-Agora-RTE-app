import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import chatContext, {controlMessageEnum} from './ChatContext';
import ColorContext from '../components/ColorContext';

const HostControlView = () => {
  const {sendControlMessage} = useContext(chatContext);
  const {primaryColor} = useContext(ColorContext);
  return (
    <>
      <Text style={style.heading}>Host Controls</Text>
      <View style={style.btnContainer}>
        <TouchableOpacity
          style={[style.secondaryBtn, {borderColor: primaryColor}]}
          onPress={() => sendControlMessage(controlMessageEnum.muteAudio)}>
          <Text style={[style.secondaryBtnText, {color: primaryColor}]}>
            Mute all audios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.secondaryBtn, {borderColor: primaryColor}]}
          onPress={() => sendControlMessage(controlMessageEnum.muteVideo)}>
          <Text style={[style.secondaryBtnText, {color: primaryColor}]}>
            Mute all videos
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    // marginBottom: 20,
    alignSelf: 'center',
  },
  btnContainer: {
    paddingHorizontal: '5%',
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  secondaryBtn: {
    width: '40%',
    borderColor: '#099DFD',
    borderWidth: 3,
    // marginHorizontal: 20,
    maxWidth: 400,
    minHeight: 45,
  },
  secondaryBtnText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    textAlignVertical: 'center',
    color: '#099DFD',
  },
});

export default HostControlView;
