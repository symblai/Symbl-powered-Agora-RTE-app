import React, {useContext} from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import icons from '../assets/icons';
import ChatContext, {controlMessageEnum} from '../components/ChatContext';
import ColorContext from '../components/ColorContext';
import {gql, useMutation} from '@apollo/client';
import {useParams} from '../components/Router';
import PropsContext from '../../agora-rn-uikit/src/PropsContext';

const START_RECORDING = gql`
  mutation startRecordingSession($passphrase: String!, $secret: String) {
    startRecordingSession(passphrase: $passphrase, secret: $secret)
  }
`;

const STOP_RECORDING = gql`
  mutation stopRecordingSession($passphrase: String!) {
    stopRecordingSession(passphrase: $passphrase)
  }
`;

const Recording = (props: any) => {
  const {rtcProps} = useContext(PropsContext);
  const {primaryColor} = useContext(ColorContext);
  const setRecordingActive = props.setRecordingActive;
  const recordingActive = props.recordingActive;
  const {phrase} = useParams();
  const [startRecordingQuery] = useMutation(START_RECORDING);
  const [stopRecordingQuery] = useMutation(STOP_RECORDING);
  const {sendControlMessage} = useContext(ChatContext);
  return (
    <TouchableOpacity
      style={[style.localButton, {borderColor: primaryColor}]}
      onPress={() => {
        if (!recordingActive) {
          startRecordingQuery({
            variables: {
              passphrase: phrase,
              secret:
                rtcProps.encryption && rtcProps.encryption.key
                  ? rtcProps.encryption.key
                  : '',
            },
          })
            .then((res) => {
              console.log(res.data);
              if (res.data.startRecordingSession === 'success') {
                sendControlMessage(controlMessageEnum.cloudRecordingActive);
                setRecordingActive(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          stopRecordingQuery({variables: {passphrase: phrase}})
            .then((res) => {
              console.log(res.data);
              if (res.data.stopRecordingSession === 'success') {
                sendControlMessage(controlMessageEnum.cloudRecordingUnactive);
                setRecordingActive(false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }}>
      <Image
        source={{
          uri: recordingActive
            ? icons.recordingActiveIcon
            : icons.recordingIcon,
        }}
        style={[style.buttonIcon, {tintColor: primaryColor}]}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  localButton: {
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#099DFD',
    borderWidth: 0,
    width: 46,
    height: 46,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 45,
    height: 35,
    tintColor: '#099DFD',
  },
});

export default Recording;
