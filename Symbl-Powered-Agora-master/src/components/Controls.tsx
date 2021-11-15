import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import LocalUserContext from '../../agora-rn-uikit/src/LocalUserContext';
import {
  LocalAudioMute,
  LocalVideoMute,
  Endcall,
} from '../../agora-rn-uikit/Components';
import Recording from '../subComponents/Recording';
import icons from '../assets/icons';
import ScreenshareButton from '../subComponents/ScreenshareButton';
import ColorContext from '../components/ColorContext';
import SymblTranscript from '../subComponents/SymblButton';
import SymblButton from '../subComponents/SymblButton';
import SymblTopictooltip from '../subComponents/SymblTopicTooltip';
import { Button, Grid, Tooltip } from '@material-ui/core';

const Controls = (props: any) => {
  const { primaryColor } = useContext(ColorContext);
  const [screenshareActive, setScreenshareActive] = useState(false);
  const {
    setRecordingActive,
    recordingActive,
    setChatDisplayed,
    setTranscriptDisplayed,
    transcriptDisplayed,
    chatDisplayed,
    isHost,
  } = props;
  return (
    <LocalUserContext>
      <View style={style.controlsHolder}>
        <TouchableOpacity
          style={[style.localButton, { borderColor: primaryColor }]}
          onPress={() => {
            if (document.getElementById('tes').style.visibility == 'hidden') {
              document.getElementById('tes').style.visibility = 'visible';
            } else {
              document.getElementById('tes').style.visibility = 'hidden';
            }
          }}
        >
          <Image
            source={{ uri: icons.closedCaption }}
            style={[style.buttonIcon, { tintColor: '' }]}
          />
          <Text
            style={{backgroundColor: '#fff', width: 70, textAlign: 'center', paddingTop: 9}}>
            Captions
          </Text>
        </TouchableOpacity>
        <LocalAudioMute />

        <LocalVideoMute />
        {isHost ? (
          $config.cloudRecording ? (
            <Recording
              recordingActive={recordingActive}
              setRecordingActive={setRecordingActive}
            />
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        {$config.screenSharing ? (
          <ScreenshareButton
            screenshareActive={screenshareActive}
            setScreenshareActive={setScreenshareActive}
          />
        ) : (
          <></>
        )}
        {$config.chat ? (
          <TouchableOpacity
            style={[style.localButton, { borderColor: primaryColor }]}
            onPress={() => {
              setChatDisplayed(!chatDisplayed);
            }}
          >
            <Image
              source={{ uri: icons.chatIcon }}
              style={[style.buttonIcon, { tintColor: primaryColor }]}
            />
            <Text
              style={{backgroundColor: '#fff', width: 70, textAlign: 'center', paddingTop: 9}}>
              Chat
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {$config.chat ? (
          <TouchableOpacity
            style={[style.localButton, { borderColor: primaryColor }]}
            onPress={() => {
              setTranscriptDisplayed(!transcriptDisplayed);
            }}
          >
            <Image
              source={{ uri: icons.symblIcon }}
              style={[style.buttonIcon, { tintColor: primaryColor }]}
            />
            <Text
              style={{backgroundColor: '#fff', width: 70, textAlign: 'center', paddingTop: 9}}>
              Insights
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        <Endcall />

        <TouchableOpacity
          style={[style.localButton, { borderColor: primaryColor }]}
          onPress={() => {
            window.open(window.localStorage.getItem('summaryUrl'));
          }}
        >
          <Image
            source={{ uri: icons.summaryButton }}
            style={[style.buttonIcon, { tintColor: primaryColor }]}
          />
          <Text
            style={{backgroundColor: '#fff', width: 70, textAlign: 'center', paddingTop: 9}}>
            Summary
          </Text>
        </TouchableOpacity>
      </View>
    </LocalUserContext>
  );
};

const style = StyleSheet.create({
  controlsHolder: {
    flex: Platform.OS === 'web' ? 1.3 : 1.6,
    maxHeight: '10%',
    paddingHorizontal: Platform.OS === 'web' ? '20%' : '1%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
    margin: 0,
    bottom: 0,
  },
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
  },
  buttonIcon: {
    width: 35,
    height: 35,
    
    tintColor: '#099DFD',
  },
});

export default Controls;
