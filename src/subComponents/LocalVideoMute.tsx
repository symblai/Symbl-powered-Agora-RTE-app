import React, {useContext} from 'react';
import RtcContext, {DispatchType} from '../../agora-rn-uikit/src/RtcContext';
import {LocalContext} from '../../agora-rn-uikit/src/LocalUserContext';
import {Image, TouchableOpacity} from 'react-native';
import icons from '../assets/icons';
import ColorContext from '../components/ColorContext';

function LocalVideoMute() {
  const {primaryColor} = useContext(ColorContext);
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <TouchableOpacity
      onPress={() => {
        (dispatch as DispatchType<'LocalMuteVideo'>)({
          type: 'LocalMuteVideo',
          value: [local.video],
        });
      }}>
      <Image
        style={[
          {
            width: 25,
            height: 22,
            marginHorizontal: 3,
            tintColor: '#099DFD',
          },
          {tintColor: primaryColor},
        ]}
        source={{uri: local.video ? icons.videocam : icons.videocamOff}}
      />
    </TouchableOpacity>
  );
}

export default LocalVideoMute;
