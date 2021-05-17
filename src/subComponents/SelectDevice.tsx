import React, {useContext} from 'react';
import {Picker, StyleSheet} from 'react-native';
import DeviceContext from '../components/DeviceContext';
import ColorContext from '../components/ColorContext';

const SelectDevice = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const {
    selectedCam,
    setSelectedCam,
    selectedMic,
    setSelectedMic,
    deviceList,
  } = useContext(DeviceContext);

  return (
    <>
      <Picker
        selectedValue={selectedCam}
        style={[style.popupPicker, {borderColor: primaryColor}]}
        onValueChange={(itemValue) => setSelectedCam(itemValue)}>
        {deviceList.map((device: any) => {
          if (device.kind === 'videoinput') {
            return (
              <Picker.Item
                label={device.label}
                value={device.deviceId}
                key={device.deviceId}
              />
            );
          }
        })}
      </Picker>
      <Picker
        selectedValue={selectedMic}
        style={[style.popupPicker, {borderColor: primaryColor}]}
        onValueChange={(itemValue) => setSelectedMic(itemValue)}>
        {deviceList.map((device: any) => {
          if (device.kind === 'audioinput') {
            return (
              <Picker.Item
                label={device.label}
                value={device.deviceId}
                key={device.deviceId}
              />
            );
          }
        })}
      </Picker>
    </>
  );
};

const style = StyleSheet.create({
  popupPicker: {
    minHeight: 45,
    paddingHorizontal: 6,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 400,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#099DFD',
    marginBottom: 10,
  },
});

export default SelectDevice;
