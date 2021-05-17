import React, {Component, useEffect, useState} from 'react';

import Tooltip from 'react-png-tooltip';
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import Emitter from '../../bridge/rtc/web/emitter';
import { TagCloud } from 'react-tagcloud';
import icons from "../assets/icons";
import { Blink, BlinkProvider } from "@bdchauvette/react-blink";
import HighlightIcon from '@material-ui/icons/Highlight';
import {yellow} from "@material-ui/core/colors";
import InputLabel from '@material-ui/core/InputLabel';
import { TextField, Grid } from "@material-ui/core";
import { Icon, Label } from 'semantic-ui-react';



const styles = StyleSheet.create({
   OrangeTooltip : {
    backgroundcolor:'#cd5c5c',
    color:"#FFF",
    fill:"#FFF"
}
});

const SymblTopicTooltip = (props:any) => {
    let t=[{value:"test",count:20}];
    const [topic,setTopic]= useState(t);
    const [blink,setBlink]=useState(true);

    Emitter.on('topic_created', (newValue) => {
        let d1=JSON.parse(newValue);
        if(d1.data.score>.01) {


            //t.push({value:d1.data.phrases,count:d1.data.score*100});
            
            let flag=true;
            for(let i=0;i<topic.length;i++)
            {
                if(topic[i].value.includes(d1.data.phrases)){
                    flag=!flag;
                    break;
                }
            }
            if(flag)
            {
                setTopic([...topic, {value: d1.data.phrases, count: d1.data.score * 100}]);
                setBlink(false);

            }
        }

    });

    return (
        <div>
        <BlinkProvider disabled={blink}>
            
        <Tooltip
            shouldDisableHover={true}

            tooltip={
                <div style={{maxHeight:"none"}}>
                <TouchableOpacity
                    style={[style.localButton, {borderColor: '#099DFD'}]}
                    onPress={() =>{setBlink(true)}}

                > <Blink>

                    <HighlightIcon fontSize={"large"} style={{ color: yellow[700] ,fontSize: 50 } }
                    /></Blink>

                </TouchableOpacity>
                </div>

            }
            className={""}
            wrapperClassName={""}
         background={"white"} fill={"white"} shouldDisableClick={false} timeoutDelay={60}>
            <TagCloud
                id="top"
                minSize={12}
                maxSize={35}
                tags={topic}
                height={400}
                style={{paddingLeft:5, paddingTop: 5,paddingBottom:5,paddingRight:5}}
                className="simple-cloud"
                onClick={tag => alert(`'${tag.value}' was selected!`)}
            >



            </TagCloud>





        </Tooltip>
        </BlinkProvider>
        </div>
);
};
const style = StyleSheet.create({
    localButton: {
        backgroundColor: '#fff',
        borderRadius: 2,
        borderColor: '#099DFD',
        // borderWidth: 1,
        width: 46,
        height: 46,
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:30

    },
    greenLocalButton: {
        backgroundColor: '#4BEB5B',
        borderRadius: 2,
        borderColor: '#F86051',
        width: 46,
        height: 46,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        width: 42,
        height: 35,
        tintColor: '#099DFD',
    },
    chatView: {
        position: 'absolute',
        zIndex: 5,
        width: '20%',
        height: '92%',
        minWidth: 200,
        maxWidth: 400,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
    },
    chatViewNative: {
        position: 'absolute',
        zIndex: 5,
        width: '100%',
        height: '90%',
        right: 0,
        top: 0,
        backgroundColor: '#fff',
    },
    heading: {
        backgroundColor: '#fff',
        width: 150,
        height: '7%',
        paddingLeft: 20,
        flexDirection: 'row',
    },
    headingText: {
        flex: 1,
        paddingLeft: 5,
        marginVertical: 'auto',
        fontWeight: '700',
        color: '#333',
        fontSize: 25,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    chatNav: {
        flexDirection: 'row',
        height: '6%',
        // marginBottom: 15,
    },
    backButton: {
        // marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    backIcon: {
        width: 20,
        height: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        tintColor: '#333',
    }
});


export default SymblTopicTooltip;