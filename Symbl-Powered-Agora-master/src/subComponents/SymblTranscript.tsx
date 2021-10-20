import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  Text,
} from 'react-native';
import icons from '../assets/icons';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import PropsContext from '../../agora-rn-uikit/src/PropsContext';
import ColorContext from '../components/ColorContext';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import { MinUidConsumer } from '../../agora-rn-uikit/src/MinUidContext';
import { MaxUidConsumer } from '../../agora-rn-uikit/src/MaxUidContext';
import { UserrIdToUSernameMappring } from '../../bridge/rtc/web/UserrIdToUSername';
import { Symbl } from '../../bridge/rtc/web/symbl';
import { cci } from '../../bridge/rtc/web/SendStream';
import {
  getInterTranscript,
  SendStream,
} from '../../bridge/rtc/web/SendStream';
import { getInterInsight } from '../../bridge/rtc/web/SendStream';
import SymblTopicTagCloud from '../components/SymblTopicCloud/SymblTopicTagCloud';
import { useTranscript } from '../hooks';
import Transcript from './Transcript';
import Insights from './Insights';

const cc = '';
interface ccc {
  ccc: '';
}
let symbl = null;
///////////
export async function sendStream(channelName, optionalUid, optionalInfo) {
  const res = await fetch('http://localhost:8081/symbl-token');
  const data = await res.json();
  ///importing username from vvideoCall.ts
  const userName = await new UserrIdToUSernameMappring().getUserMap(
    optionalUid,
  );
  const interTranscript = '';
  const interInsight = '';
  const config = {
    attendeeId: userName,
    meetingId: 'Meeting 1',
    userName: userName,
    meeting: channelName,
  };
  console.log('Got symbl token', data, config);
  Symbl.ACCESS_TOKEN = data.accessToken;
  symbl = new Symbl(config);
  symbl.start();
}

const getContent = (data) => {
  const punctuated = data.data.punctuated;
  const payload = data.data.payload;
  console.log(JSON.stringify(punctuated));

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

export default function SymblTranscript(props: any) {
  const { primaryColor } = useContext(ColorContext);
  console.log('symbl value', symbl);
  const {
    interTranscript,
    show,
    usernameshow,
    setTranscriptDisplayed,
    username,
  } = props;

  const [TRANSCRIPT, INSIGHTS, TOPICS] = ['Transcript', 'Insights', 'Topics'];
  const [tabHeader, setTabHeader] = useState(TRANSCRIPT);

  const [insightActive, setInsightActive] = useState(false);
  const [transcriptActive, setTranscriptActive] = useState(true);
  const [topicActive, setTopicActive] = useState(false);
  const [intermediateTranscript, setIntermediateTranscript] = useState('');

  const [closedCaptionResponse, setClosedCaptionResponse] = useState({});

  const { transcriptItems, insights } = useTranscript();

  //////

  if (symbl != null) {
    const insightHandler = {
      onInsightCreated: (insight) => {
        console.log('Insight created', insight, insight.type);
        // insight.createElement();
        const div = document.createElement('div');
      },
    };
    symbl.subscribeToInsightEvents(insightHandler);
    const transcriptHandler = {
      onTranscriptCreated: (transcript) => {
        console.log('On transcript created', transcript);
      },
    };
    symbl.subscribeToTranscriptEvents(transcriptHandler);

    const _caption = '';
    const captioningHandler = {
      onCaptioningToggled: (ccEnabled) => {
        // Implement
      },
      onCaptionCreated: (caption) => {
        console.warn('Caption created 1', caption);
        ////new code added for caption ;
        // cc.current=caption;
      },
      onCaptionUpdated: (caption) => {
        // Check if the video element is set correctly

        const videoElementContainer = document.getElementsByClassName(
          'main-stream-player',
        )[0];
        const check = document.getElementById('test');
        console.log(getContent(caption));
        //cc.current=caption;
        setClosedCaptionResponse(caption);
        console.log('Symbl Transcript' + closedCaptionResponse);
      },
    };
    symbl.subscribeToCaptioningEvents(captioningHandler);
  }

  //////

  useEffect(() => {
    setClosedCaptionResponse(cc);
    console.log('inside symbl transcript' + closedCaptionResponse);
  }, [closedCaptionResponse]);

  console.log('inside st' + closedCaptionResponse);

  useEffect(() => {
    setClosedCaptionResponse(cc);
    console.log('inside  UE' + closedCaptionResponse);
  }, []);
  useEffect(() => {
    console.log('inside use effect transcript' + symbl);
    if (document.getElementById('ST') != null) {
      document.getElementById('ST').innerHTML = getInterTranscript();
    }
  }, [transcriptActive]);
  useEffect(() => {
    console.log('inside use effect transcript' + symbl);
    if (document.getElementById('ST2') != null) {
      document.getElementById('ST2').innerHTML = getInterInsight();
    }
  }, [insightActive]);

  const selectTranscript = () => {
    setTranscriptActive(true);
    setInsightActive(false);
    setTopicActive(false);
    setTabHeader(TRANSCRIPT);
    console.log('intertranscript' + getInterTranscript());
  };
  const selectInsight = () => {
    // document.getElementById("ST2").innerHTML=getInterInsight();
    setTranscriptActive(false);
    setInsightActive(true);
    setTopicActive(false);
    setTabHeader(INSIGHTS);
  };
  const selectTopic = () => {
    // document.getElementById("ST2").innerHTML=getInterInsight();
    setTranscriptActive(false);
    setInsightActive(false);
    setTopicActive(true);
    setTabHeader(TOPICS);
  };
  //let intermediateTranscript=`<div></div>`;
  const intermediateInsight = '<div></div>';

  const toggle = false;

  return show ? (
    <View style={Platform.OS === 'web' ? style.chatView : style.chatViewNative}>
      <View style={style.heading}>
        <TouchableOpacity
          style={style.backButton}
          onPress={() => setTranscriptDisplayed(false)}
        >
          <Image
            resizeMode={'contain'}
            style={style.backIcon}
            source={{ uri: icons.backBtn }}
          />
          <Text style={style.headingText}>{tabHeader}</Text>
        </TouchableOpacity>
      </View>
      <View style={style.chatNav}>
        <TouchableOpacity
          onPress={selectTranscript}
          style={
            transcriptActive
              ? [style.groupActive, { borderColor: primaryColor }]
              : [
                  style.group,
                  {
                    borderColor: primaryColor,
                    borderTopColor: primaryColor + '80',
                  },
                ]
          }
        >
          <Text
            style={transcriptActive ? style.groupTextActive : style.groupText}
          >
            {TRANSCRIPT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={selectInsight}
          style={
            insightActive
              ? [style.groupActive, { borderColor: primaryColor }]
              : [
                  style.group,
                  {
                    borderColor: primaryColor,
                    borderTopColor: primaryColor + '80',
                  },
                ]
          }
        >
          <Text style={insightActive ? style.groupTextActive : style.groupText}>
            {INSIGHTS}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={selectTopic}
          style={
            insightActive
              ? [style.groupActive, { borderColor: primaryColor }]
              : [
                  style.group,
                  {
                    borderColor: primaryColor,
                    borderTopColor: primaryColor + '80',
                  },
                ]
          }
        >
          <Text style={topicActive ? style.groupTextActive : style.groupText}>
            {TOPICS}
          </Text>
        </TouchableOpacity>
      </View>
      {transcriptActive ? (
        <Transcript transcript={transcriptItems} />
      ) : (
        <>
          {insightActive ? (
            <Insights insights={insights} />
          ) : (
            <>{topicActive ? <SymblTopicTagCloud /> : <></>}</>
          )}
        </>
      )}
    </View>
  ) : (
    ''
  );
}

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
    overflow: 'scroll',
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
  },
  groupActive: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#099DFD',
    height: '100%',
    textAlign: 'center',
  },
  group: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#B4E1FF',
    borderRightWidth: 2,
    borderColor: '#099DFD',
    height: '100%',
    textAlign: 'center',
  },
  privateActive: {
    backgroundColor: '#fff',
    // borderBottomWidth: 2,
    borderTopWidth: 2,
    // borderTopColor: '#B4E1FF',
    borderColor: '#099DFD',
    flex: 1,
    height: '100%',
    textAlign: 'center',
  },
  private: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderTopColor: '#B4E1FF',
    borderColor: '#099DFD',
    flex: 1,
    height: '100%',
    // paddingLeft: 20,
    textAlign: 'center',
  },
  groupTextActive: {
    marginVertical: 'auto',
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  groupText: {
    marginVertical: 'auto',
    fontWeight: '700',
    textAlign: 'center',
    color: '#C1C1C1',
    fontSize: 16,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});

//export default SymblTranscript;
