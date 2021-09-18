import { Symbl } from './symbl';
import React, { useCallback, useState, createContext } from 'react';
import { UserrIdToUSernameMappring } from '../web/UserrIdToUSername';

import SessionContext from '../../../src/components/SessionContext';
import { v4 as uuidv4 } from 'uuid';
import { PropsInterface } from '../../../agora-rn-uikit/src/PropsContext';
export let cci = '';
let tti = '';
import symblConfig from '../../../SymblConfig';

import Emitter from './emitter';

const getContent = (data) => {
  const punctuated = data.data.punctuated;
  const payload = data.data.payload;

  if (punctuated && punctuated.transcript) {
    return punctuated.transcript;
  } else if (payload && payload.content) {
    return payload.content;
  } else if (
    payload &&
    payload.raw &&
    payload.raw.alternatives &&
    payload.raw.alternatives.length > 0
  ) {
    return payload.raw.alternatives[0].transcript || '';
  }
  return undefined;
};
export const SymblContext = React.createContext(null);
export const StorageConsumer = SymblContext.Consumer;
let m = new Map();
let symbl = null,
  sS = null;
let interTranscript = '';
let interInsight = '';
let interTopic = '';

export function getInterTranscript() {
  return interTranscript;
}
export function getInterInsight() {
  return interInsight;
}
export async function SendStream(channelName, optionalUid, optionalInfo) {
  if (symbl && sS) {
    return { sS, symbl };
  }

  if (symbl && optionalInfo && optionalInfo.transcript) {
    return { symbl, sS };
  }

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  let raw = JSON.stringify({
    type: 'application',
    appId: symblConfig.symbl_AppId,
    appSecret: symblConfig.symbl_AppSecret,
  });

  let Options = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const data = window.localStorage.getItem('symblTokenBE');
  ///importing username from vvideoCall.ts
  const userName = new UserrIdToUSernameMappring().getUserMap(optionalUid);
  const un = document.getElementById('username').innerText;

  let mId = uuidv4();
  const config = {
    attendeeId: userName,
    userName: un,
    meetingId: channelName,
    meeting: channelName,
  };
  Symbl.ACCESS_TOKEN = window.localStorage.getItem('symblTokenBE'); //data.accessToken;
  symbl = new Symbl(config);
  var _caption = '';
  const captioningHandler = {
    onCaptioningToggled: (ccEnabled) => {
      // Implement
    },
    onCaptionCreated: (caption) => {
      ////new code added for caption ;
      cci = caption;
      // Retrieve the video element that you wish to add the subtitle tracks to.
      // var activeVideoElement = document.querySelector("video");
      var videoElementContainer = document.getElementsByClassName(
        'main-stream-player',
      )[0];
      if (videoElementContainer) {
        const activeVideoElement = videoElementContainer.querySelector('video');
        caption.setVideoElement(activeVideoElement);
      }
    },
    onCaptionUpdated: (caption) => {
      // Check if the video element is set correctly

      var videoElementContainer = document.getElementsByClassName(
        'main-stream-player',
      )[0];
      var check = document.getElementById('test');
      cci = JSON.stringify(caption);

      //setClosedCaptionResponse(caption);
      if (document.getElementById('tes') != null) {
        document.getElementById('tes').innerText =
          caption.data.user.name + ':' + getContent(caption);
      }

      if (videoElementContainer) {
        const activeVideoElement = videoElementContainer.querySelector('video');
        caption.setVideoElement(activeVideoElement);
      }
    },
  };
  symbl.subscribeToCaptioningEvents(captioningHandler);

  sS = await symbl.start();
  window.sS = sS;
  window.symbl = symbl;

  if (!m.has(channelName)) {
  }

  return { sS, symbl };
}
