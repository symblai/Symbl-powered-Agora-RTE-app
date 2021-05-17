import React, {useEffect, useRef} from 'react';
import {StyleProp, StyleSheet, ViewProps, ViewStyle} from 'react-native';
import {VideoMirrorMode, VideoRenderMode} from 'react-native-agora/lib/Types';
import type AgoraRtcEngine from 'agora-electron-sdk';

export interface RtcSurfaceViewProps extends ViewProps {
  zOrderMediaOverlay?: boolean;
  zOrderOnTop?: boolean;
  renderMode?: VideoRenderMode;
  channelId?: string;
  mirrorMode?: VideoMirrorMode;
}
export interface RtcUidProps {
  uid: number | 'local';
}
export interface StyleProps {
  style?: StyleProp<ViewStyle>;
}

interface SurfaceViewInterface
  extends RtcSurfaceViewProps,
    RtcUidProps,
    StyleProps {}

const SurfaceView = (props: SurfaceViewInterface) => {
  console.log('Surface View props', props);
  const canvasElem = useRef(null);
  useEffect(() => {
    window.engine.resizeRender(props.uid, props.channelId);
  });

  useEffect(
    function () {
      const engine: AgoraRtcEngine = window.engine;
      const uid = props.uid;

      if (uid === 'local') {
        engine.setupLocalVideo(canvasElem.current);
        engine.setupViewContentMode(uid, 1);
      } else {
        engine.setupRemoteVideo(props.uid, canvasElem.current, props.channelId);
        engine.setupViewContentMode(uid, 1);
      }

      return () => {
        console.log(`unmounting stream ${props.uid}`);
        engine.setupRemoteVideo(
          props.uid === 'local' ? 0 : props.uid,
          false,
          props.channelId,
        );
      };
    },
    [props.uid],
  );

  return (
    <div
      id={String(props.uid) + '-player'}
      ref={canvasElem}
      className={'video-container'}
      style={{flex: 1, ...(props.style as Object)}}
    />
  );
};

export default SurfaceView;
