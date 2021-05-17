import React, {useContext, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useHistory} from '../components/Router';
import SessionContext from '../components/SessionContext';
import OpenInNativeButton from '../subComponents/OpenInNativeButton';
import Logo from '../subComponents/Logo';
import LogoutButton from '../subComponents/LogoutButton';
import ColorContext from '../components/ColorContext';
import Illustration from '../subComponents/Illustration';

// const joinFlag = 0;
interface joinProps {
  phrase: string;
  onChangePhrase: (text: string) => void;
}
const Join = (props: joinProps) => {
  const history = useHistory();
  const {primaryColor} = useContext(ColorContext);
  const {joinSession} = useContext(SessionContext);
  const [error, setError] = useState(null);
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  let onLayout = (e: any) => {
    setDim([e.nativeEvent.layout.width, e.nativeEvent.layout.height]);
  };
  const createMeeting = () => {
    history.push('/create');
  };

  const phrase = props.phrase;
  const onChangePhrase = props.onChangePhrase;
  const startCall = async () => {
    joinSession({phrase});
  };
  return (
    <ImageBackground
      onLayout={onLayout}
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
                  style={{
                    fontWeight: '500',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
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
        <View style={style.content}>
          <View style={style.leftContent}>
            <Text style={style.heading}>{$config.landingHeading}</Text>
            <Text style={style.headline}>{$config.landingSubHeading}</Text>
            <View style={style.inputs}>
              <TextInput
                style={[style.textInput, {borderColor: primaryColor}]}
                value={phrase}
                onChangeText={(text) => onChangePhrase(text)}
                onSubmitEditing={() => startCall()}
                placeholder="Meeting ID"
                placeholderTextColor="#777"
              />
              <TouchableOpacity
                style={
                  phrase === ''
                    ? [
                        style.primaryBtnDisabled,
                        {backgroundColor: primaryColor + '80'},
                      ]
                    : [style.primaryBtn, {backgroundColor: primaryColor}]
                }
                disabled={phrase === ''}
                onPress={() => startCall()}>
                <Text style={style.primaryBtnText}>Enter</Text>
              </TouchableOpacity>
              <View style={style.ruler} />
              <TouchableOpacity
                style={[style.secondaryBtn, {borderColor: primaryColor}]}
                onPress={() => createMeeting()}>
                <Text style={[style.secondaryBtnText, {color: primaryColor}]}>
                  Create a meeting
                </Text>
              </TouchableOpacity>
              {$config.ENABLE_OAUTH ? (
                <LogoutButton setError={setError} />
              ) : (
                <></>
              )}
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
      </View>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  full: {flex: 1},
  illustration: {flex: 1, alignSelf: 'flex-end'},
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
    marginVertical: '5%',
    marginRight: '5%',
  },
  heading: {
    fontSize: 40,
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
    minHeight: 45,
  },
  primaryBtnDisabled: {
    width: '60%',
    backgroundColor: '#099DFD80',
    maxWidth: 400,
    minHeight: 45,
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
  ruler: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 200,
  },
  secondaryBtn: {
    width: '60%',
    borderColor: '#099DFD',
    borderWidth: 3,
    maxWidth: 400,
    minHeight: 45,
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
});

export default Join;
