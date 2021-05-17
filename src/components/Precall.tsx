import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {MaxUidConsumer} from '../../agora-rn-uikit/src/MaxUidContext';
import {MaxVideoView} from '../../agora-rn-uikit/Components';
import {LocalAudioMute, LocalVideoMute} from '../../agora-rn-uikit/Components';
import LocalUserContext from '../../agora-rn-uikit/src/LocalUserContext';
import SelectDevice from '../subComponents/SelectDevice';
import Logo from '../subComponents/Logo';
import OpenInNativeButton from '../subComponents/OpenInNativeButton';
import ColorContext from '../components/ColorContext';
import {useHistory} from './Router';

const Precall = (props: any) => {
  const history = useHistory();
  const {primaryColor} = useContext(ColorContext);
  const {setCallActive, queryComplete, username, setUsername, error} = props;
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
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => history.replace('./')}>
                <Text
                  style={{
                    fontWeight: '500',
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                  }}>
                  Go back
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          {/* <OpenInNativeButton /> */}
        </View>
        <View style={style.content}>
          <View style={style.leftContent}>
            <MaxUidConsumer>
              {(maxUsers) => (
                <MaxVideoView user={maxUsers[0]} key={maxUsers[0].uid} />
              )}
            </MaxUidConsumer>
            <View style={style.precallControls}>
              <LocalUserContext>
                <LocalVideoMute />
                <LocalAudioMute />
              </LocalUserContext>
            </View>
            {dim[0] < dim[1] + 150 ? (
              <View style={style.margin5Btm}>
                <TextInput
                  style={[style.textInput, {borderColor: primaryColor}]}
                  value={username}
                  onChangeText={(text) => {
                    if (username !== 'Getting name...') {
                      setUsername(text);
                    }
                  }}
                  onSubmitEditing={() => {}}
                  placeholder="Display Name"
                  placeholderTextColor="#777"
                />
                <View style={style.margin5Btm} />
                <TouchableOpacity
                  onPress={() => setCallActive(true)}
                  disabled={!queryComplete}
                  style={
                    queryComplete
                      ? [style.primaryBtn, {backgroundColor: primaryColor}]
                      : [
                          style.primaryBtnDisabled,
                          {backgroundColor: primaryColor + '80'},
                        ]
                  }>
                  <Text style={style.primaryBtnText}>
                    {queryComplete ? 'Join Room' : 'Loading...'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>
          {dim[0] >= dim[1] + 150 ? (
            <View style={style.full}>
              <View style={[style.precallPickers, {shadowColor: primaryColor}]}>
                <Text style={style.subHeading}>Select Input Device</Text>
                <SelectDevice />
                <TextInput
                  style={[style.textInput, {borderColor: primaryColor}]}
                  value={username}
                  onChangeText={(text) => {
                    if (username !== 'Getting name...') {
                      setUsername(text);
                    }
                  }}
                  onSubmitEditing={() => {}}
                  placeholder="Display Name"
                  placeholderTextColor="#777"
                />
                <TouchableOpacity
                  onPress={() => setCallActive(true)}
                  disabled={!queryComplete}>
                  <View
                    style={
                      queryComplete
                        ? [style.primaryBtn, {backgroundColor: primaryColor}]
                        : [
                            style.primaryBtnDisabled,
                            {backgroundColor: primaryColor + '80'},
                          ]
                    }>
                    <Text style={style.primaryBtnText}>
                      {queryComplete ? 'Join Room' : 'Loading...'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    flex: 1.3,
    justifyContent: 'space-evenly',
    marginTop: '2.5%',
    marginBottom: '5%',
    marginRight: '5%',
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
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
    alignSelf: 'center',
  },
  primaryBtn: {
    width: '60%',
    backgroundColor: '#099DFD',
    maxWidth: 400,
    minHeight: 45,
    alignSelf: 'center',
  },
  primaryBtnDisabled: {
    width: '60%',
    backgroundColor: '#099DFD80',
    maxWidth: 400,
    minHeight: 45,
    minWidth: 200,
    alignSelf: 'center',
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
  precallControls: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 10,
    width: '60%',
    justifyContent: 'space-around',
    marginVertical: '5%',
  },
  precallPickers: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: '5%',
    marginBottom: '25%',
    marginTop: '10%',
    shadowColor: '#099DFD',
    shadowRadius: 5,
    borderRadius: 5,
  },
  margin5Btm: {marginBottom: '5%'},
});

export default Precall;
