import AgoraRTM, {VERSION} from 'agora-rtm-sdk';

export default class RtmEngine {
  public appId: string;
  public client: any;
  public channelMap = new Map<string, any>([]);
  public remoteInvititations = new Map<string, any>([]);
  public localInvititations = new Map<string, any>([]);
  public channelEventsMap = new Map<string, any>([
    ['channelMessageReceived', () => null],
    ['channelMemberJoined', () => null],
    ['MemberLeft', () => null],
  ]);
  public clientEventsMap = new Map<string, any>([
    ['connectionStateChanged', () => null],
    ['messageReceived', () => null],
    ['remoteInvitationReceived', () => null],
    ['tokenExpired', () => null],
  ]);
  public localInvitationEventsMap = new Map<string, any>([
    ['localInvitationAccepted', () => null],
    ['localInvitationCanceled', () => null],
    ['localInvitationFailure', () => null],
    ['localInvitationReceivedByPeer', () => null],
    ['localInvitationRefused', () => null],
  ]);
  public remoteInvitationEventsMap = new Map<string, any>([
    ['remoteInvitationAccepted', () => null],
    ['remoteInvitationCanceled', () => null],
    ['remoteInvitationFailure', () => null],
    ['remoteInvitationRefused', () => null],
  ]);
  constructor() {
    this.appId = '';
    console.log('Using RTM Bridge');
  }

  on(event: any, listener: any) {
    if (
      event === 'channelMessageReceived' ||
      event === 'channelMemberJoined' ||
      event === 'channelMemberLeft'
    ) {
      this.channelEventsMap.set(event, listener);
    } else if (
      event === 'connectionStateChanged' ||
      event === 'messageReceived' ||
      event === 'remoteInvitationReceived' ||
      event === 'tokenExpired'
    ) {
      this.clientEventsMap.set(event, listener);
    } else if (
      event === 'localInvitationAccepted' ||
      event === 'localInvitationCanceled' ||
      event === 'localInvitationFailure' ||
      event === 'localInvitationReceivedByPeer' ||
      event === 'localInvitationRefused'
    ) {
      this.localInvitationEventsMap.set(event, listener);
    } else if (
      event === 'remoteInvitationAccepted' ||
      event === 'remoteInvitationCanceled' ||
      event === 'remoteInvitationFailure' ||
      event === 'remoteInvitationRefused'
    ) {
      this.remoteInvitationEventsMap.set(event, listener);
    }
  }

  createClient(APP_ID: string) {
    this.appId = APP_ID;
    this.client = AgoraRTM.createInstance(this.appId);

    this.client.on('ConnectionStateChanged', (state, reason) => {
      this.clientEventsMap.get('connectionStateChanged')({state, reason});
    });

    this.client.on('MessageFromPeer', (msg, uid, msgProps) => {
      this.clientEventsMap.get('messageReceived')({
        text: msg.text,
        ts: msgProps.serverReceivedTs,
        offline: msgProps.isOfflineMessage,
        peerId: uid,
      });
    });

    this.client.on('RemoteInvitationReceived', (remoteInvitation: any) => {
      this.remoteInvititations.set(remoteInvitation.callerId, remoteInvitation);
      this.clientEventsMap.get('remoteInvitationReceived')({
        callerId: remoteInvitation.callerId,
        content: remoteInvitation.content,
        state: remoteInvitation.state,
        channelId: remoteInvitation.channelId,
        response: remoteInvitation.response,
      });

      remoteInvitation.on('RemoteInvitationAccepted', () => {
        this.remoteInvitationEventsMap.get('RemoteInvitationAccepted')({
          callerId: remoteInvitation.callerId,
          content: remoteInvitation.content,
          state: remoteInvitation.state,
          channelId: remoteInvitation.channelId,
          response: remoteInvitation.response,
        });
      });

      remoteInvitation.on('RemoteInvitationCanceled', (content: string) => {
        this.remoteInvitationEventsMap.get('remoteInvitationCanceled')({
          callerId: remoteInvitation.callerId,
          content: content,
          state: remoteInvitation.state,
          channelId: remoteInvitation.channelId,
          response: remoteInvitation.response,
        });
      });

      remoteInvitation.on('RemoteInvitationFailure', (reason: string) => {
        this.remoteInvitationEventsMap.get('remoteInvitationFailure')({
          callerId: remoteInvitation.callerId,
          content: remoteInvitation.content,
          state: remoteInvitation.state,
          channelId: remoteInvitation.channelId,
          response: remoteInvitation.response,
          code: -1, //Web sends string, RN expect number but can't find enum
        });
      });

      remoteInvitation.on('RemoteInvitationRefused', () => {
        this.remoteInvitationEventsMap.get('remoteInvitationRefused')({
          callerId: remoteInvitation.callerId,
          content: remoteInvitation.content,
          state: remoteInvitation.state,
          channelId: remoteInvitation.channelId,
          response: remoteInvitation.response,
        });
      });
    });

    this.client.on('TokenExpired', () => {
      this.clientEventsMap.get('tokenExpired')({}); //RN expect evt: any
    });
  }

  async login(loginParam: {uid: string, token?: string}): Promise<any> {
    return this.client.login(loginParam);
  }

  async logout(): Promise<any> {
    return this.client.logout();
  }

  async joinChannel(channelId: string): Promise<any> {
    this.channelMap.set(channelId, this.client.createChannel(channelId));
    this.channelMap.get(channelId).on('ChannelMessage', (msg: {text: string}, uid: string, messagePros) => {
        let text = msg.text;
        let ts = messagePros.serverReceivedTs;
        this.channelEventsMap.get('channelMessageReceived')({uid, channelId, text, ts});
      });
    this.channelMap.get(channelId).on('MemberJoined', (uid: string) => {
      this.channelEventsMap.get('channelMemberJoined')({uid, channelId});
    });
    this.channelMap.get(channelId).on('MemberLeft', (uid: string) => {
      this.channelEventsMap.get('channelMemberLeft')(uid);
    });
    return this.channelMap.get(channelId).join();
  }

  async leaveChannel(channelId: string): Promise<any> {
    if (this.channelMap.get(channelId)) {
      return this.channelMap.get(channelId).leave();
    } else {
      Promise.reject('Wrong channel');
    }
  }

  async sendMessageByChannelId(channel: string, message: string): Promise<any> {
    if (this.channelMap.get(channel)) {
      return this.channelMap.get(channel).sendMessage({text: message});
    } else {
      console.log(this.channelMap, channel);
      Promise.reject('Wrong channel');
    }
  }

  destroyClient() {
    console.log('Destroy called');
    this.channelEventsMap.forEach((callback, event) => {
      this.client.off(event, callback);
    });
    this.channelEventsMap.clear();
    this.channelMap.clear();
    this.clientEventsMap.clear();
    this.remoteInvitationEventsMap.clear();
    this.localInvitationEventsMap.clear();
  }

  async getChannelMembersBychannelId(channel: string) {
    if (this.channelMap.get(channel)) {
      let memberArray: Array<any> = [];
      let currentChannel = this.channelMap.get(channel);
      await currentChannel.getMembers().then((arr: Array<number>) => {
        arr.map((elem: number) => {
          memberArray.push({
            channelId: channel,
            uid: elem,
          });
        });
      });
      return {members: memberArray};
    } else {
      Promise.reject('Wrong channel');
    }
  }

  async queryPeersOnlineStatus(uid: Array<String>) {
    let peerArray: Array<any> = [];
    await this.client.queryPeersOnlineStatus(uid).then((list) => {
      Object.entries(list).forEach((value) => {
        peerArray.push({
          online: value[1],
          uid: value[0],
        });
      });
    });
    return {items: peerArray};
  }

  async renewToken(token: string) {
    return this.client.renewToken(token);
  }

  async getUserAttributesByUid(uid: string) {
    let response = {};
    await this.client
      .getUserAttributes(uid)
      .then((attributes: string) => {
        response = {attributes, uid};
      })
      .catch((e: any) => {
        Promise.reject(e);
      });
    return response;
  }

  async removeAllLocalUserAttributes() {
    return this.client.clearLocalUserAttributes();
  }

  async removeLocalUserAttributesByKeys(keys: string[]) {
    return this.client.deleteLocalUserAttributesByKeys(keys);
  }

  async replaceLocalUserAttributes(attributes: string[]) {
    let formattedAttributes: any = {};
    attributes.map((attribute) => {
      let key = Object.values(attribute)[0];
      let value = Object.values(attribute)[1];
      formattedAttributes[key] = value;
    });
    return this.client.setLocalUserAttributes({...formattedAttributes});
  }

  async setLocalUserAttributes(attributes: string[]) {
    let formattedAttributes: any = {};
    attributes.map((attribute) => {
      let key = Object.values(attribute)[0];
      let value = Object.values(attribute)[1];
      formattedAttributes = {[key]: value};
      // console.log('!!!!formattedAttributes', formattedAttributes, key, value);
    });
    return this.client.setLocalUserAttributes({...formattedAttributes});
  }

  async sendLocalInvitation(invitationProps: any) {
    let invite = this.client.createLocalInvitation(invitationProps.uid);
    this.localInvititations.set(invitationProps.uid, invite);
    invite.content = invitationProps.content;

    invite.on('LocalInvitationAccepted', (response: string) => {
      this.localInvitationEventsMap.get('localInvitationAccepted')({
        calleeId: invite.calleeId,
        content: invite.content,
        state: invite.state,
        channelId: invite.channelId,
        response,
      });
    });

    invite.on('LocalInvitationCanceled', () => {
      this.localInvitationEventsMap.get('localInvitationCanceled')({
        calleeId: invite.calleeId,
        content: invite.content,
        state: invite.state,
        channelId: invite.channelId,
        response: invite.response,
      });
    });

    invite.on('LocalInvitationFailure', (reason: string) => {
      this.localInvitationEventsMap.get('localInvitationFailure')({
        calleeId: invite.calleeId,
        content: invite.content,
        state: invite.state,
        channelId: invite.channelId,
        response: invite.response,
        code: -1, //Web sends string, RN expect number but can't find enum
      });
    });

    invite.on('LocalInvitationReceivedByPeer', () => {
      this.localInvitationEventsMap.get('localInvitationReceivedByPeer')({
        calleeId: invite.calleeId,
        content: invite.content,
        state: invite.state,
        channelId: invite.channelId,
        response: invite.response,
      });
    });

    invite.on('LocalInvitationRefused', (response: string) => {
      this.localInvitationEventsMap.get('localInvitationRefused')({
        calleeId: invite.calleeId,
        content: invite.content,
        state: invite.state,
        channelId: invite.channelId,
        response: response,
      });
    });
    return invite.send();
  }

  async sendMessageToPeer(AgoraPeerMessage: {
    peerId: string;
    offline: boolean;
    text: string;
  }) {
    return this.client.sendMessageToPeer(
      {text: AgoraPeerMessage.text},
      AgoraPeerMessage.peerId,
    );
    //check promise result
  }

  async acceptRemoteInvitation(remoteInvitationProps: {
    uid: string;
    response?: string;
    channelId: string;
  }) {
    let invite = this.remoteInvititations.get(remoteInvitationProps.uid);
    // console.log(invite);
    // console.log(this.remoteInvititations);
    // console.log(remoteInvitationProps.uid);
    return invite.accept();
  }

  async refuseRemoteInvitation(remoteInvitationProps: {
    uid: string;
    response?: string;
    channelId: string;
  }) {
    return this.remoteInvititations.get(remoteInvitationProps.uid).refuse();
  }

  async cancelLocalInvitation(LocalInvitationProps: {
    uid: string;
    content?: string;
    channelId?: string;
  }) {
    console.log(this.localInvititations.get(LocalInvitationProps.uid));
    return this.localInvititations.get(LocalInvitationProps.uid).cancel();
  }

  getSdkVersion(callback: (version: string) => void) {
    callback(VERSION);
  }
}
