/* eslint-disable prettier/prettier */

/*
X create
X muteLocalAudioStream
X muteLocalVideoStream
 switchCamera
X enableVideo
X addListener
X destroy
X joinChannel
X leaveChannel
X muteRemoteAudioStream
X muteRemoteVideoStream
*/

import AgoraRTC from 'agora-electron-sdk';
import type {
  RtcEngineEvents,
  Subscription,
} from 'react-native-agora/lib/RtcEvents';

type callbackType = (uid?: number) => void;
type UidWithElapsedCallbackType = (
  channel: string,
  uid: number,
  elapsed: number,
) => void;

declare global {
  interface Window {
    engine: RtcEngine;
  }
}

export default class RtcEngine {
  public appId: string;
  public agoraRtcEngine: AgoraRTC;
  public eventsMap = new Map<string, callbackType>([
    ['UserJoined', () => null],
    ['UserOffline', () => null],
    ['ScreenshareStopped', () => null],
    ['RemoteAudioStateChanged', () => null],
    ['RemoteVideoStateChanged', () => null],
  ]);
  private inScreenshare: Boolean = false;

  constructor(appId: string) {
    this.appId = appId;
    this.agoraRtcEngine = new AgoraRTC();
  }
  static async create(appId: string): Promise<RtcEngine> {
    let engine = new RtcEngine(appId);
    let init = new Promise((resolve, reject) => {
      engine.agoraRtcEngine.initialize(appId);
      window.engine = engine.agoraRtcEngine;
      resolve();
    });
    console.log("create invoked", engine);
    await init;
    engine.agoraRtcEngine.startPreview();
    return engine;
  }

  async enableVideo(): Promise<void> {
    let enable = new Promise((resolve, reject) => {
      this.agoraRtcEngine.enableVideo() === 0 ? resolve() : reject();
    });
    await enable;
    console.log("enabled video")
  }

  async joinChannel(
    token: string,
    channelName: string,
    optionalInfo: string,
    optionalUid: number,
  ): Promise<void> {
    let self = this;
    let join = new Promise((resolve, reject) => {
      this.agoraRtcEngine.on('userJoined', (uid, elapsed) => {
        (this.eventsMap.get('UserJoined') as callbackType)(uid);
      });
      this.agoraRtcEngine.on('userOffline', (uid, reason) => {
        (this.eventsMap.get('UserOffline') as callbackType)(uid);
      });
      this.agoraRtcEngine.on('remoteAudioStateChanged', (uid, state, reason, elapsed) => {
        console.log(uid);
        (this.eventsMap.get('RemoteAudioStateChanged') as callbackType)([uid, state, reason, elapsed]);
      });
      this.agoraRtcEngine.on('remoteVideoStateChanged', (uid, state, reason, elapsed) => {
        (this.eventsMap.get('RemoteVideoStateChanged') as callbackType)([uid, state, reason, elapsed]);
      });
      this.agoraRtcEngine.on('joinedChannel', (channel, uid, elapsed) => {
        if(this.eventsMap.get('JoinChannelSuccess')){
          (this.eventsMap.get(
            'JoinChannelSuccess',
          ) as UidWithElapsedCallbackType)(channel, uid, elapsed);
        }
        resolve();
      });
      this.agoraRtcEngine.joinChannel(
        token,
        channelName,
        optionalInfo,
        optionalUid,
      );
    });
    await join;
  }

  async leaveChannel(): Promise<void> {
    let leave = new Promise((resolve, reject) => {
      this.agoraRtcEngine.on('leaveChannel', () => {
        resolve();
      });
      this.agoraRtcEngine.leaveChannel();
    });
    await leave;
  }

  addListener<EventType extends keyof RtcEngineEvents>(
    event: EventType,
    listener: RtcEngineEvents[EventType],
  ): Subscription {
    if (
      event === 'UserJoined' ||
      event === 'UserOffline' || 
      event === 'JoinChannelSuccess' ||
      event === 'ScreenshareStopped' ||
      event === 'RemoteAudioStateChanged' ||
      event === 'RemoteVideoStateChanged'
    ) {
      this.eventsMap.set(event, listener as callbackType);
    }
    return {
      remove: () => {
        console.log(
          'Use destroy method to remove all the event listeners from the RtcEngine instead.',
        );
      },
    };
  }

  async muteLocalAudioStream(muted: boolean): Promise<void> {
    try {
      this.agoraRtcEngine.muteLocalAudioStream(muted);
    } catch (e) {
        console.error('\n Be sure to invoke the enableVideo method before using this method.',
      );
    }
  }

  async muteLocalVideoStream(muted: boolean): Promise<void> {
    try {
      this.agoraRtcEngine.muteLocalVideoStream(muted);
    } catch (e) {
      console.error(
        e,
        '\n Be sure to invoke the enableVideo method before using this method.',
      );
    }
  }

  async muteRemoteAudioStream(uid: number, muted: boolean): Promise<void> {
    try {
      this.agoraRtcEngine.muteRemoteAudioStream(uid, muted);
    } catch (e) {
      console.error(e);
    }
  }

  async muteRemoteVideoStream(uid: number, muted: boolean): Promise<void> {
    try {
      this.agoraRtcEngine.muteRemoteVideoStream(uid, muted);
    } catch (e) {
      console.error(e);
    }
  }

  getDevices(callback: (devices: any) => void): void {
    let vdevices = this.agoraRtcEngine.getVideoDevices()
    vdevices = vdevices.map( d => ({ kind:'videoinput', deviceId:d.deviceid, label:d.devicename}))
    let adevices = this.agoraRtcEngine.getAudioRecordingDevices()
    adevices = adevices.map( d => ({kind:'audioinput', deviceId:d.deviceid, label:d.devicename}))
    let devices = [...adevices, ...vdevices];
    callback(devices);
  }

  changeCamera(cameraId, callback, error) {
    this.agoraRtcEngine.setVideoDevice(cameraId);
    callback();
  }

  changeMic(micId, callback, error) {
    this.agoraRtcEngine.setAudioRecordingDevice(micId);
    callback();
  }

  startPreview() {
    this.enableVideo();
    this.agoraRtcEngine.startPreview();
  }

  async enableDualStreamMode(option: boolean) {
    this.agoraRtcEngine.enableDualStreamMode(option) === 0 ? Promise.resolve() : Promise.reject('error in enabledualstream');
  }

  async setRemoteSubscribeFallbackOption(option: 0 | 1 | 2) {
      this.agoraRtcEngine.setRemoteSubscribeFallbackOption(option) === 0 ? Promise.resolve() : Promise.reject('error in setremotefallback');
  }

  async setEncryptionSecret(secret: string) {
    this.agoraRtcEngine.setEncryptionSecret(secret);
  }

    async setEncryptionMode(encryptionMode: 'aes-128-xts' | 'aes-256-xts' | 'aes-128-ecb') {
      this.agoraRtcEngine.setEncryptionMode(encryptionMode);
  }

  async destroy(): Promise<void> {
    this.agoraRtcEngine.release();
    this.eventsMap.clear();
  }

  getScreenDisplaysInfo() {
    return this.agoraRtcEngine.getScreenDisplaysInfo();
  }

  startScreenshare(screen = null) {
    if (!this.inScreenshare) {
      // let screens = this.agoraRtcEngine.getScreenDisplaysInfo();
      let captureParam = {
        bitrate: 0,
        frameRate: 5,
        height: screen.height,
        width: screen.width,
      };
      let rect = {
        height: screen.height,
        width: screen.width,
        x: 0,
        y: 0,
      };
      console.log('startScreenCapture: ', this.agoraRtcEngine.startScreenCaptureByScreen(screen.displayId, rect, captureParam));
      this.inScreenshare = true;
    } else {
      console.log('stopScreenCapture: ', this.agoraRtcEngine.stopScreenCapture());
      (this.eventsMap.get('ScreenshareStopped') as callbackType)();
      this.inScreenshare = false;
    }
  }
}
