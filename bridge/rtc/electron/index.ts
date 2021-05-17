import RtcEngine from './RtcEngine';
import SurfaceView from "./SurfaceView";
import LocalView from  './LocalView'
import * as Types from './Types';

export const RtcLocalView = {
    SurfaceView: LocalView,
    TextureView: LocalView
}

export const RtcRemoteView = {
    SurfaceView: SurfaceView,
    TextureView: SurfaceView
}

export const VideoRenderMode = {...Types.VideoRenderMode};
  
export default RtcEngine;