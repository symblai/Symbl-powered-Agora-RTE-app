import React, {useContext} from 'react';
import RtcContext, {DispatchType} from '../../agora-rn-uikit/src/RtcContext';
import {LocalContext} from '../../agora-rn-uikit/src/LocalUserContext';
import {Image, TouchableOpacity} from 'react-native';
import icons from '../assets/icons';
import ColorContext from '../components/ColorContext';

function LocalAudioMute() {
  const {primaryColor} = useContext(ColorContext);
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <TouchableOpacity
      onPress={() => {
        (dispatch as DispatchType<'LocalMuteAudio'>)({
          type: 'LocalMuteAudio',
          value: [local.audio],
        });
      }}>
      <Image
        style={[
          {
            width: 24,
            height: 24,
            tintColor: '#099DFD',
          },
          {tintColor: primaryColor},
        ]}
        source={{uri: local.audio ? icons.mic : icons.micOff}}
      />
    </TouchableOpacity>
  );
}

export default LocalAudioMute;
