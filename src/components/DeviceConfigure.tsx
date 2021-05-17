import React, {useState, useContext, useEffect} from 'react';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import DeviceContext from './DeviceContext';

const DeviceConfigure: React.FC = (props: any) => {
  const [selectedCam, setSelectedCam] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [deviceList, setDeviceList] = useState([]);
  const rtc = useContext(RtcContext);

  useEffect(() => {
    if (deviceList.length === 0) {
      rtc.RtcEngine.getDevices(function (devices: any) {
        setDeviceList(devices);
        for (const i in devices) {
          if (devices[i].kind === 'videoinput') {
            setSelectedCam(devices[i].deviceId);
            break;
          }
        }
        for (const i in devices) {
          if (devices[i].kind === 'audioinput') {
            setSelectedMic(devices[i].deviceId);
            break;
          }
        }
      });
    }
  });

  useEffect(() => {
    if (selectedCam.length !== 0) {
      rtc.RtcEngine.changeCamera(
        selectedCam,
        () => {},
        (e: any) => console.log(e),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCam]);

  useEffect(() => {
    if (selectedCam.length !== 0) {
      rtc.RtcEngine.changeMic(
        selectedMic,
        () => {},
        (e: any) => console.log(e),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMic]);

  return (
    <DeviceContext.Provider
      value={{
        selectedCam,
        setSelectedCam,
        selectedMic,
        setSelectedMic,
        deviceList,
        setDeviceList,
      }}>
      {true ? props.children : <></>}
    </DeviceContext.Provider>
  );
};

export default DeviceConfigure;
