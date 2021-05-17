import React, {useContext, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Picker,
  Text,
  StyleSheet,
} from 'react-native';
import icons from '../assets/icons';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import ColorContext from '../components/ColorContext';

const ScreenshareButton = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const [screenListActive, setScreenListActive] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [screens, setScreens] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const rtc = useContext(RtcContext);
  const {screenshareActive, setScreenshareActive} = props;
  rtc.RtcEngine.addListener('ScreenshareStopped', () => {
    setScreenshareActive(false);
  });
  return (
    <>
      <TouchableOpacity
        style={
          screenshareActive
            ? style.greenLocalButton
            : [style.localButton, {borderColor: primaryColor}]
        }
        disabled={buttonDisabled}
        onPress={() => {
          if (!screenshareActive) {
            setScreenshareActive(true);
            setScreens(rtc.RtcEngine.getScreenDisplaysInfo());
            setScreenListActive(true);
            setButtonDisabled(true);
          } else {
            rtc.RtcEngine.startScreenshare();
          }
        }}>
        <Image
          source={{uri: icons.screenshareIcon}}
          style={[style.buttonIcon, {tintColor: primaryColor}]}
        />
      </TouchableOpacity>
      {screenListActive ? (
        <View style={style.popupView}>
          <Text style={style.popupText}>Please select a screen to share:</Text>
          <Picker
            selectedValue={selectedScreen}
            style={style.popupPicker}
            onValueChange={(itemValue) => setSelectedScreen(itemValue)}>
            {screens.map((device: any, i) => {
              console.log(device, i);
              return (
                <Picker.Item label={'screen' + (i + 1)} value={i} key={i} />
              );
            })}
          </Picker>
          <TouchableOpacity
            onPress={() => {
              rtc.RtcEngine.startScreenshare(screens[selectedScreen]);
              setScreenListActive(false);
              setScreenshareActive(true);
              setButtonDisabled(false);
            }}
            style={style.popupButton}>
            <Text style={style.buttonText}>Start Sharing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </>
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
    width: 40,
    height: 35,
    tintColor: '#099DFD',
  },
  popupView: {
    position: 'absolute',
    top: '-400%',
    left: '20%',
    width: '60%',
    height: '350%',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    paddingVertical: 5,
  },
  popupText: {
    width: '100%',
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
  popupPicker: {
    height: '40%',
    width: '50vw',
    alignSelf: 'center',
    // paddingVertical: 2,
    // marginVertical: 5,
  },
  popupButton: {
    backgroundColor: '#6E757D',
    height: '20%',
    width: '50vw',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  popupPickerHolder: {
    // height: '40%',
    justifyContent: 'space-around',
  },
  buttonText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
  },
});

export default ScreenshareButton;
