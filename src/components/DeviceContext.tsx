import {createContext} from 'react';

interface DeviceContext {
  selectedCam: any;
  setSelectedCam: (cam: any) => void;
  selectedMic: any;
  setSelectedMic: (mic: any) => void;
  deviceList: Array<any>;
  setDeviceList: (devices: any) => void;
}

const DeviceContext = createContext((null as unknown) as DeviceContext);
export default DeviceContext;
