import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {MinUidConsumer} from '../../agora-rn-uikit/src/MinUidContext';
import {MaxUidConsumer} from '../../agora-rn-uikit/src/MaxUidContext';
import LocalAudioMute from '../subComponents/LocalAudioMute';
import LocalVideoMute from '../subComponents/LocalVideoMute';
import LocalUserContext from '../../agora-rn-uikit/src/LocalUserContext';
import RemoteAudioMute from '../subComponents/RemoteAudioMute';
import RemoteVideoMute from '../subComponents/RemoteVideoMute';
import RemoteEndCall from '../subComponents/RemoteEndCall';
import chatContext from '../components/ChatContext';
import Clipboard from '../subComponents/Clipboard';
import ColorContext from '../components/ColorContext';
import {useParams} from './Router';
import {gql, useQuery} from '@apollo/client';
import icons from '../assets/icons';
import platform from '../subComponents/Platform';
import Transcript from "./transcript";

const SHARE = gql`
  query share($passphrase: String!) {
    share(passphrase: $passphrase) {
      passphrase {
        host
        view
      }
      channel
      title
      pstn {
        number
        dtmf
      }
    }
  }
`;

const ParticipantView = (props: any) => {
  const {userList, localUid} = useContext(chatContext);
  const {primaryColor} = useContext(ColorContext);
  const {phrase} = useParams();
  const {data, loading, error} = useQuery(SHARE, {
    variables: {passphrase: phrase},
  });
  const copyToClipboard = () => {
    if (data && !loading) {
      let stringToCopy = '';
      $config.frontEndURL
        ? (stringToCopy += `Meeting - ${data.share.title}
URL for Attendee: ${$config.frontEndURL}/${data.share.passphrase.view}
URL for Host: ${$config.frontEndURL}/${data.share.passphrase.host}`)
        : platform === 'web'
        ? (stringToCopy += `Meeting - ${data.share.title}
URL for Attendee: ${window.location.origin}/${data.share.passphrase.view}
URL for Host: ${window.location.origin}/${data.share.passphrase.host}`)
        : (stringToCopy += `Meeting - ${data.share.title}
Attendee Meeting ID: ${data.share.passphrase.view}
Host Meeting ID: ${data.share.passphrase.host}`);

      data.share.pstn
        ? (stringToCopy += `PSTN Number: ${data.share.pstn.number}
PSTN Pin: ${data.share.pstn.dtmf}`)
        : '';
      console.log(stringToCopy);
      Clipboard.setString(stringToCopy);
    }
  };

  return (
    <View
      style={
        Platform.OS === 'web'
          ? style.participantView
          : style.participantViewNative
      }>
      <TouchableOpacity
        style={style.backButton}
        onPress={() => props.setParticipantsView(false)}>
        <Image
          resizeMode={'contain'}
          style={style.backIcon}
          source={{uri: icons.backBtn}}
        />
        <Text style={style.heading}>Participants</Text>
      </TouchableOpacity>
      <MinUidConsumer>
        {(minUsers) => (
          <MaxUidConsumer>
            {(maxUser) =>
              [...minUsers, ...maxUser].map((user) =>
                user.uid !== 'local' ? (
                  <View style={style.participantContainer} key={user.uid}>

                    <Text style={style.participantText}>
                      {userList[user.uid]
                        ? userList[user.uid].name + ' '
                        : 'User '}
                    </Text>
                    <View style={style.participantButtonContainer}>
                      <RemoteAudioMute
                        uid={user.uid}
                        audio={user.audio}
                        isHost={props.isHost}
                      />
                      <RemoteVideoMute
                        uid={user.uid}
                        video={user.video}
                        isHost={props.isHost}
                      />
                      <RemoteEndCall uid={user.uid} isHost={props.isHost} />
                    </View>

                  </View>
                ) : (
                  <View style={style.participantContainer} key={user.uid}>
                    <Text style={style.participantText}>
                      {userList[localUid]
                        ? userList[localUid].name + ' '
                        : 'You '}
                    </Text>
                    <View style={style.participantButtonContainer}>
                      <LocalUserContext>
                        <LocalAudioMute />
                        <LocalVideoMute />
                      </LocalUserContext>
                    </View>
                  </View>
                ),
              )
            }

          </MaxUidConsumer>
        )}
      </MinUidConsumer>

      <TouchableOpacity
        style={[style.secondaryBtn, {borderColor: primaryColor}]}
        onPress={() => copyToClipboard()}>
        <Text style={[style.secondaryBtnText, {color: primaryColor}]}>
          {!data ? 'Getting Data' : 'Copy joining details'}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const style = StyleSheet.create({
  participantView: {
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
  participantViewNative: {
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    height: '100%',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    // textAlign: 'center',
    color: '#333',
  },
  participantContainer: {
    flexDirection: 'row',
    flex: 0.07,
    backgroundColor: '#fff',
    height: '15%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantText: {
    flex: 1,
    fontSize: Platform.OS === 'web' ? 20 : 16,
    fontWeight: '500',
    flexDirection: 'row',
    color: '#333',
    lineHeight: 20,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  participantButtonContainer: {
    // flex: 0.3,
    flexDirection: 'row',
    paddingRight: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  secondaryBtn: {
    alignSelf: 'center',
    width: '60%',
    borderColor: '#099DFD',
    borderWidth: 3,
    maxWidth: 400,
    minHeight: 42,
    minWidth: 200,
    marginTop: 'auto',
  },
  secondaryBtnText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    textAlignVertical: 'center',
    color: '#099DFD',
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
});

export default ParticipantView;
