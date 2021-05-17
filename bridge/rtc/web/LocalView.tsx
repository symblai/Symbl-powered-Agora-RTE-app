import React from "react";
import SurfaceView, {RtcSurfaceViewProps, StyleProps} from "./SurfaceView";

interface LocalViewInterface extends RtcSurfaceViewProps, StyleProps{}

export default function LocalView (props: LocalViewInterface) {
    console.log("LocalView props: ", props)
    return <SurfaceView uid={0} {...props} />
}