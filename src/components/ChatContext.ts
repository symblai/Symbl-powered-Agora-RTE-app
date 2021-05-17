import RtmEngine from 'agora-react-native-rtm';
import {createContext} from 'react';

export interface channelMessage {
  type: string;
  msg: string;
  ts: string;
  uid: string;
}

export interface messageStoreInterface {
  ts: string;
  uid: string;
  msg: string;
}

interface chatContext {
  messageStore: messageStoreInterface | any;
  privateMessageStore: any;
  sendMessage: (msg: string) => void;
  sendMessageToUid: (msg: string, uid: number) => void;
  sendControlMessage: (msg: string) => void;
  sendControlMessageToUid: (msg: string, uid: number) => void;
  engine: RtmEngine;
  localUid: string;
  userList: any;
  // peersRTM: Array<string>;
}

export enum controlMessageEnum {
  muteVideo = '1',
  muteAudio = '2',
  muteSingleVideo = '3',
  muteSingleAudio = '4',
  kickUser = '5',
  cloudRecordingActive = '6',
  cloudRecordingUnactive = '7',
}

const ChatContext = createContext((null as unknown) as chatContext);

export default ChatContext;
