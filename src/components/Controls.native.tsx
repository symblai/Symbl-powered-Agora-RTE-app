import React, { useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import LocalUserContext from '../../agora-rn-uikit/src/LocalUserContext';
import {
  LocalAudioMute,
  LocalVideoMute,
  SwitchCamera,
  Endcall,
} from '../../agora-rn-uikit/Components';
import Recording from '../subComponents/Recording';
import icons from '../assets/icons';
import ColorContext from '../components/ColorContext';

const Controls = (props: any) => {
  const setRecordingActive = props.setRecordingActive;
  const recordingActive = props.recordingActive;
  const setChatDisplayed = props.setChatDisplayed;
  const chatDisplayed = props.chatDisplayed;
  const {primaryColor} = useContext(ColorContext);
  return (
    <LocalUserContext>
      <View style={style.bottomBar}>
        <LocalAudioMute />
        <LocalVideoMute />
        <Recording
          recordingActive={recordingActive}
          setRecordingActive={setRecordingActive}
        />
        <SwitchCamera />
        <TouchableOpacity
          style={[style.localButton, {borderColor: primaryColor}]}
          onPress={() => {
            setChatDisplayed(!chatDisplayed);
          }}>
          <Image
            source={{uri: icons.chatIcon}}
            style={[style.buttonIcon, {tintColor: primaryColor}]}
          />
        </TouchableOpacity>
        <Endcall />
      </View>
    </LocalUserContext>
  );
};

const style = StyleSheet.create({
  bottomBar: {
    flex: Platform.OS === 'web' ? 1.3 : 1.6,
    paddingHorizontal: Platform.OS === 'web' ? '20%' : '1%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
    margin: 0,
    bottom: 0,
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
  buttonIcon: {
    width: 35,
    height: 35,
    tintColor: '#099DFD',
  },
});

export default Controls;
