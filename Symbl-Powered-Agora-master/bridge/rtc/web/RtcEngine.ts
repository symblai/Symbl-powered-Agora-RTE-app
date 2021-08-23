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

import AgoraRTC from 'agora-rtc-sdk';
import {SendStream} from './SendStream';
import {SymblSocket} from '../web/symbl';
import {Symbl} from '../web/symbl';
//import {SendStream} from '../../../src/subComponents/SymblTranscript';
//import {SendStream} from '../../../src/pages/VideoCall'
import type { RtcEngineEvents, Subscription } from 'react-native-agora/lib/RtcEvents';

//
// export interface StreamsInterface {
//     [uid: number]: AgoraRTC.Stream;
// }

type callbackType = (uid?: number) => void;

declare global {
    interface Window {
        engine: RtcEngine
    }
}


export default class RtcEngine {
    public appId: string;
    // public AgoraRTC: any;
    public client: AgoraRTC.Client;
    public screenClient: AgoraRTC.Client;
    public eventsMap = new Map<string, callbackType>([
        ['UserJoined', () => null],
        ['UserOffline', () => null],
        ['ScreenshareStopped', () => null],
        ['RemoteAudioStateChanged', () => null],
        ['RemoteVideoStateChanged', () => null],
    ]);
    public streams = new Map<number, AgoraRTC.Stream>();
    public symblSocket:SymblSocket= null;
    public symbl:Symbl= null;
    public streamSpec: AgoraRTC.StreamSpec;
    public streamSpecScreenshare: AgoraRTC.StreamSpec;
    private localUid: number = 0;
    private localScreenUid: number = 0;
    private inScreenshare: Boolean = false;
    private removeStream = (evt: { uid: string }) => {
        let uid = parseInt(evt.uid, 10);
        if (this.streams.has(uid)) {
            this.streams.delete(uid);
            (this.eventsMap.get('UserOffline') as callbackType)(uid);
        }
    }

    constructor(appId: string) {
        this.appId = appId;
        // this.AgoraRTC = AgoraRTC;
        this.client = AgoraRTC.createClient({
            codec: 'vp8',
            mode: 'live',
        });
        this.screenClient = AgoraRTC.createClient({
            codec: 'vp8',
            mode: 'live',
        });
        this.streamSpec = {
            video: true,
            audio: true,
        };
        this.streamSpecScreenshare = {
            audio: false,
            video: false,
            screen: true,
            screenAudio: true,
        };
    }
    static async create(appId: string): Promise<RtcEngine> {

        let engine = new RtcEngine(appId);
        let init = new Promise(((resolve, reject) => {
            engine.client.init(appId, function () {
                window.engine = engine;
                resolve();
            }, function (err) {
                console.error(err);
                reject();
            });
        }));
        await init;

        return engine;
    }

    async enableVideo(): Promise<void> {
        let enable = new Promise(((resolve, reject) => {
            this.streams.set(0, AgoraRTC.createStream(this.streamSpec));
            (this.streams.get(0)  as AgoraRTC.Stream).setVideoProfile('480p_9');
            (this.streams.get(0) as AgoraRTC.Stream).init(() => {
                resolve();
            },reject);
        }));
        await enable;
    }

    async joinChannel(token: string, channelName: string, optionalInfo: string, optionalUid: number): Promise<void> {
        let self = this;
        //code for symbl
        let obj = await SendStream(channelName,optionalUid,optionalInfo);
        this.symblSocket = obj.sS;
        this.symbl = obj.symbl;
        console.log('constructor name' + this.symblSocket.constructor.name);

        //
        let join = new Promise((resolve, reject) => {

            this.client.on('stream-added', (evt) => {

                this.inScreenshare ?
                    evt.stream.getId() !== this.streams.get(1).getId() ?
                        this.client.subscribe(evt.stream)
                        : (this.eventsMap.get('UserJoined') as callbackType)(1)
                    : this.client.subscribe(evt.stream);
            });
            this.client.on('stream-subscribed', (evt) => {
                this.streams.set(evt.stream.getId(), evt.stream);

                (this.eventsMap.get('UserJoined') as callbackType)(evt.stream.getId());
            });
            this.client.on('stream-removed', (evt) => {
                console.log('triggered');
                this.removeStream(evt);
            });
            this.client.on('peer-leave', (evt) => {
                console.log('triggered');
                this.removeStream(evt);
            });
            this.client.on('stream-published', (evt) => {
                (this.eventsMap.get('JoinChannelSuccess') as callbackType)();
            });
            this.client.on('mute-audio', (evt) => {

                (this.eventsMap.get('RemoteAudioStateChanged') as callbackType)(evt.uid, 0, 0, 0);
            });
            this.client.on('unmute-audio', (evt) => {
                (this.eventsMap.get('RemoteAudioStateChanged') as callbackType)(evt.uid, 2, 0, 0);
            });
            this.client.on('mute-video', (evt) => {
                (this.eventsMap.get('RemoteVideoStateChanged') as callbackType)(evt.uid, 0, 0, 0);
            });
            this.client.on('unmute-video', (evt) => {
                (this.eventsMap.get('RemoteVideoStateChanged') as callbackType)(evt.uid, 2, 0, 0);
            });
            this.client.join(token || null, channelName, optionalUid || null, (uid) => {
                this.localUid = uid as number;
                this.client.publish(this.streams.get(0) as AgoraRTC.Stream);
                resolve();
            }, reject);
        });
        await join;
    }

    async leaveChannel(): Promise<void> {
        this.client.leave();
        this.streams.forEach((stream, uid, map) => {
            stream.close();
        });
        this.streams.clear();


    }

    addListener<EventType extends keyof RtcEngineEvents>(event: EventType, listener: RtcEngineEvents[EventType]): Subscription {
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
                console.log('Use destroy method to remove all the event listeners from the RtcEngine instead.');
            },
        };
    }

    async muteLocalAudioStream(muted: boolean): Promise<void> {
        try {
            (this.streams.get(0) as AgoraRTC.Stream)[muted ? 'muteAudio' : 'unmuteAudio']();
            this.symblSocket.mute(muted); console.log('conversation Id RTC' + this.symblSocket._conversationId + muted + JSON.stringify(this.symblSocket));

        }
        catch (e) {
            console.error(e, '\n Be sure to invoke the enableVideo method before using this method.');
        }
    }

    async muteLocalVideoStream(muted: boolean): Promise<void> {
        try {
            (this.streams.get(0) as AgoraRTC.Stream)[muted ? 'muteVideo' : 'unmuteVideo']();
        }
        catch (e) {
            console.error(e, '\n Be sure to invoke the enableVideo method before using this method.');
        }
    }

    async muteRemoteAudioStream(uid: number, muted: boolean): Promise<void> {
        try {
            (this.streams.get(uid) as AgoraRTC.Stream)[muted ? 'muteAudio' : 'unmuteAudio']();
        }
        catch (e) {
            console.error(e);
        }
    }

    async muteRemoteVideoStream(uid: number, muted: boolean): Promise<void> {
        try {
            (this.streams.get(uid) as AgoraRTC.Stream)[muted ? 'muteVideo' : 'unmuteVideo']();
        }
        catch (e) {
            console.error(e);
        }
    }

    getDevices(callback: (devices: any) => void): void {
        AgoraRTC.getDevices(devices => callback(devices));
    }

    changeCamera(cameraId, callback, error) {
        (this.streams.get(0) as AgoraRTC.Stream).switchDevice('video', cameraId, () => callback(), (e) => error(e));
    }

    changeMic(micId, callback, error) {
        (this.streams.get(0) as AgoraRTC.Stream).switchDevice('audio', micId, () => callback(), (e) => error(e));
    }

    async enableDualStreamMode(option: boolean) {
        option ? this.client.enableDualStream(
            () => Promise.resolve(null),
            () => Promise.reject('error in enable dual stream'))
        : this.client.disableDualStream(
            () => Promise.resolve(null),
            () => Promise.reject('error in disable dual stream'));
    }

    async setRemoteSubscribeFallbackOption(option: 0 | 1 | 2) {
        this.streams.forEach(stream => {
            this.client.setStreamFallbackOption(stream, option);
        });
        Promise.resolve();
        console.log('!set fallback');
    }

    setEncryptionSecret(secret: string) {
        this.client.setEncryptionSecret(secret);
    }

    setEncryptionMode(encryptionMode: 'aes-128-xts' | 'aes-256-xts' | 'aes-128-ecb') {
        this.client.setEncryptionMode(encryptionMode);
    }

    async destroy(): Promise<void> {
        if (this.inScreenshare) {
            (this.eventsMap.get('UserOffline') as callbackType)(1);
            this.screenClient.leave();
            (this.eventsMap.get('ScreenshareStopped') as callbackType)();
        }
        this.eventsMap.forEach((callback, event, map) => {
            this.client.off(event, callback);
        });
        this.eventsMap.clear();
        if (this.streams.size !== 0) {
            this.streams.forEach((stream, uid, map) => {
                stream.close();
            });
            this.streams.clear();



        }
        this.symbl.stop();
        this.symblSocket.stopRequest();
        console.log(await this.symblSocket.close() + 'trying to close symbl socket');




    }
    async startScreenshare(token: string, channelName: string, optionalInfo: string, optionalUid: number, appId: string, engine: AgoraRTC, encryption: {screenKey: string; mode: 'aes-128-xts' | 'aes-256-xts' | 'aes-128-ecb'}): Promise<void> {
        if (!this.inScreenshare) {
            let init = new Promise(((resolve, reject) => {
                engine.screenClient.init(appId, function () {
                    resolve();
                }, function (err) {
                    console.error(err);
                    reject();
                });
            }));
            await init;

            let enable = new Promise(((resolve, reject) => {
                this.streams.set(1, AgoraRTC.createStream(this.streamSpecScreenshare));
                (this.streams.get(1) as AgoraRTC.Stream).init(() => {
                    resolve();
                }, reject);
            }));
            await enable;

            let join = new Promise((resolve, reject) => {
                if (encryption && encryption.screenKey && encryption.mode) {
                    this.screenClient.setEncryptionSecret(encryption.screenKey);
                    this.screenClient.setEncryptionMode(encryption.mode);
                }
                this.screenClient.join(token || null, channelName, optionalUid || null, (uid) => {
                    this.localScreenUid = uid as number;
                    this.screenClient.publish(this.streams.get(1) as AgoraRTC.Stream);
                    resolve();
                }, reject);
            });
            await join;
            this.inScreenshare = true;

            this.streams.get(1).on('stopScreenSharing', (evt) => {
                (this.eventsMap.get('UserOffline') as callbackType)(1);
                (this.streams.get(1) as AgoraRTC.Stream).close();
                this.screenClient.leave();
                (this.eventsMap.get('ScreenshareStopped') as callbackType)();
                this.inScreenshare = false;
            });
        }
        else {
            (this.eventsMap.get('UserOffline') as callbackType)(1);
            this.screenClient.leave();
            (this.eventsMap.get('ScreenshareStopped') as callbackType)();
            try {
                (this.streams.get(1) as AgoraRTC.Stream).close();
            } catch (err) {
                throw err;
            }
            this.inScreenshare = false;
        }
    }
}
