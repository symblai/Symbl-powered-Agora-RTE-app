import React, {useContext} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import ChatContext, {controlMessageEnum} from '../components/ChatContext';
import icons from '../assets/icons';

const RemoteEndCall = (props: {uid: number; isHost: boolean}) => {
  const {sendControlMessageToUid} = useContext(ChatContext);
  return props.isHost ? (
    <TouchableOpacity
      style={style.remoteButton}
      onPress={() => {
        sendControlMessageToUid(controlMessageEnum.kickUser, props.uid);
      }}>
      <Image
        style={style.buttonIconEnd}
        source={{uri: icons.endCall}}
        resizeMode={'contain'}/>
    </TouchableOpacity>
  ) : (
    <></>
  );
};

const style = StyleSheet.create({
  remoteButton: {
    width: 30,
    height: 25,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
  buttonIconEnd: {
    width: 30,
    height: 25,
    // marginLeft: 3,
    tintColor: '#f86051',
  },
});

export default RemoteEndCall;
