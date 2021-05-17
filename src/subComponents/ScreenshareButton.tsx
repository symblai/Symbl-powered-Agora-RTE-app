import React, {useContext} from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import icons from '../assets/icons';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import PropsContext from '../../agora-rn-uikit/src/PropsContext';
import ColorContext from '../components/ColorContext';

const ScreenshareButton = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const rtc = useContext(RtcContext);
  const {screenshareActive, setScreenshareActive} = props;
  const {channel, appId, screenShareUid, screenShareToken, encryption} = useContext(PropsContext).rtcProps;

  rtc.RtcEngine.addListener('ScreenshareStopped', () => {
    setScreenshareActive(false);
  });
  return (
    <TouchableOpacity
      style={
        screenshareActive
          ? style.greenLocalButton
          : [style.localButton, {borderColor: primaryColor}]
      }
      onPress={() => {
        setScreenshareActive(true);
        rtc.RtcEngine.startScreenshare(
          screenShareToken,
          channel,
          null,
          screenShareUid,
          appId,
          rtc.RtcEngine,
          encryption,
        );
      }}>
      <Image
        source={{
          uri: screenshareActive
            ? icons.screenshareOffIcon
            : icons.screenshareIcon,
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
    // borderWidth: 1,
    width: 46,
    height: 46,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenLocalButton: {
    backgroundColor: '#4BEB5B',
    borderRadius: 2,
    borderColor: '#F86051',
    width: 46,
    height: 46,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 42,
    height: 35,
    tintColor: '#099DFD',
  },
});

export default ScreenshareButton;
