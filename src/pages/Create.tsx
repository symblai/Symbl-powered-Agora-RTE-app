import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Checkbox from '../subComponents/Checkbox';
import {gql, useMutation} from '@apollo/client';
import Logo from '../subComponents/Logo';
import OpenInNativeButton from '../subComponents/OpenInNativeButton';
import Share from '../components/Share';
import ColorContext from '../components/ColorContext';
import Illustration from '../subComponents/Illustration';
import {SendStream} from "../../bridge/rtc/web/SendStream";
import SymblCredentialOptions from "../components/SymblCredentialOptions"
import {Dialog} from "@material-ui/core";

type PasswordInput = {
  host: string;
  view: string;
};

const CREATE_CHANNEL = gql`
  mutation CreateChannel($title: String!, $enablePSTN: Boolean) {
    createChannel(title: $title, enablePSTN: $enablePSTN) {
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


const Create = () => {
  const {primaryColor} = useContext(ColorContext);
  const [roomTitle, onChangeRoomTitle] = useState('');
  const [pstnCheckbox, setPstnCheckbox] = useState(false);
  const [hostControlCheckbox, setHostControlCheckbox] = useState(true);
  const [urlView, setUrlView] = useState(null);
  const [urlHost, setUrlHost] = useState(null);
  const [pstn, setPstn] = useState(null);
  // const [pstnPin, setPstnPin] = useState(null);
  const [roomCreated, setRoomCreated] = useState(false);
  const [joinPhrase, setJoinPhrase] = useState(null);
  const [createChannel, {data, loading, error}] = useMutation(CREATE_CHANNEL);
  const [symblCredOpen,setSymblCredOpen]=useState(true);
  const handleSymblClose = (value) => {
    setSymblCredOpen(false);
  };

  console.log('mutation data', data);

  const createRoom = () => {



    if (roomTitle !== '') {
      console.log('Create room invoked');
      createChannel({
        variables: {
          title: roomTitle,
          enablePSTN: pstnCheckbox,
        },
      })
        .then((res: any) => {
          console.log('promise data', res);
          setUrlView(res.data.createChannel.passphrase.view);
          setUrlHost(res.data.createChannel.passphrase.host);
          setPstn(res.data.createChannel.pstn);
          setJoinPhrase(res.data.createChannel.passphrase.host);
          // setPstnPin(res.data.createChannel.pstn.)
          setRoomCreated(true);
          //SendStream(roomTitle,roomTitle,roomTitle);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  let onLayout = (e: any) => {
    setDim([e.nativeEvent.layout.width, e.nativeEvent.layout.height]);
  };

  return (
    <ImageBackground
      source={{uri: $config.bg}}
      style={style.full}
      resizeMode={'cover'}>
      <View style={style.main}>
        <View style={style.nav}>
          <Logo />
          {error ? (
            <View
              style={{
                position: 'absolute',
                borderWidth: 2,
                borderColor: '#ff0000',
                backgroundColor: '#ffffff80',
                paddingHorizontal: 10,
                paddingVertical: 2,
                maxWidth: 250,
                width: '65%',
                left: 0,
                right: 0,
                top: '30%',
                marginHorizontal: 'auto',
                zIndex: 55,
            }}>
              <Text style={{alignSelf: 'center'}}>
                <Text
                  style={{fontWeight: '500', textAlign: 'center', fontSize: 16}}>
                  {error.name + ' - '}
                </Text>
                <Text style={{}}>{error.message}</Text>
              </Text>
            </View>
          ) : (
            <></>
          )}
          {/* <OpenInNativeButton /> */}
        </View>

        <SymblCredentialOptions open={symblCredOpen} onClose={handleSymblClose}></SymblCredentialOptions>

        {!roomCreated ? (

          <View style={style.content} onLayout={onLayout}>

            <View style={style.leftContent}>
              <Text style={style.heading}>Create Meeting</Text>
              <Text style={style.headline}>
                The Real-Time Engagement Platform for meaningful human
                connections.
              </Text>
              <View style={style.inputs}>
                <TextInput
                  style={[style.textInput, {borderColor: primaryColor}]}
                  value={roomTitle}
                  onChangeText={(text) => onChangeRoomTitle(text)}
                  onSubmitEditing={() => createRoom()}
                  placeholder="Enter Room Name"
                  placeholderTextColor="#777"
                  autoCorrect={false}
                />
                {$config.pstn ? (
                  <View style={style.checkboxHolder}>
                    <Checkbox
                      value={pstnCheckbox}
                      onValueChange={setPstnCheckbox}
                    />
                    <View style={style.checkboxTextHolder}>
                      <Text style={style.checkboxTitle}>Use PSTN</Text>
                      <Text style={style.checkboxCaption}>
                        Join by dialing a number
                      </Text>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <View style={style.checkboxHolder}>
                  <Checkbox
                    value={hostControlCheckbox}
                    onValueChange={setHostControlCheckbox}
                  />
                  <View style={style.checkboxTextHolder}>
                    <Text style={style.checkboxTitle}>
                      Restrict Host Controls
                    </Text>
                    <Text style={style.checkboxCaption}>
                      {!hostControlCheckbox
                        ? 'Everyone is a Host'
                        : 'Host uses a seperate link'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  disabled={roomTitle === '' || loading}
                  style={
                    roomTitle === '' || loading
                      ? [
                          style.primaryBtnDisabled,
                          {backgroundColor: primaryColor + '80'},
                        ]
                      : [style.primaryBtn, {backgroundColor: primaryColor}]
                  }
                  onPress={() => createRoom()}>
                  <Text style={style.primaryBtnText}>
                    {loading ? 'Loading...' : 'Create Meeting'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {dim[0] > dim[1] + 150 ? (
              <View style={style.full}>
                {/* <View style={{flex: 1, backgroundColor: '#00ff00', opacity: 0}} /> */}
                <Illustration />
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <Share
            urlView={urlView}
            urlHost={urlHost}
            pstn={pstn}
            hostControlCheckbox={hostControlCheckbox}
            joinPhrase={joinPhrase}
            roomTitle={roomTitle}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  full: {flex: 1},
  main: {
    flex: 2,
    justifyContent: 'space-evenly',
    marginHorizontal: '10%',
  },
  nav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {flex: 6, flexDirection: 'row'},
  leftContent: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    marginBottom: '5%',
    marginRight: '5%',
    marginHorizontal: 'auto',
  },
  heading: {
    fontSize: 38,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  headline: {
    fontSize: 20,
    fontWeight: '400',
    color: '#777',
    marginBottom: 20,
  },
  inputs: {
    flex: 1,
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textInput: {
    width: '100%',
    paddingLeft: 8,
    borderColor: '#099DFD',
    borderWidth: 2,
    color: '#333',
    fontSize: 16,
    marginBottom: 15,
    maxWidth: 400,
    minHeight: 45,
  },
  primaryBtn: {
    width: '60%',
    backgroundColor: '#099DFD',
    maxWidth: 400,
    minWidth: 200,
    minHeight: 45,
  },
  primaryBtnDisabled: {
    width: '60%',
    backgroundColor: '#96D7FE',
    maxWidth: 400,
    minHeight: 45,
    minWidth: 200,
  },
  primaryBtnText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
  },
  checkboxHolder: {
    marginVertical: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTitle: {
    color: '#333',
    paddingHorizontal: 5,
    fontWeight: '700',
  },
  checkboxCaption: {color: '#333', paddingHorizontal: 5},
  checkboxTextHolder: {
    marginVertical: 0, //check if 5
    flexDirection: 'column',
  },
  urlTitle: {
    color: '#333',
    fontSize: 14,
  },
  urlHolder: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
    maxWidth: 400,
    minHeight: 45,
  },
  url: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  pstnHolder: {
    flexDirection: 'row',
    width: '80%',
  },
  pstnMargin: {
    marginRight: '10%',
  },
});

export default Create;
