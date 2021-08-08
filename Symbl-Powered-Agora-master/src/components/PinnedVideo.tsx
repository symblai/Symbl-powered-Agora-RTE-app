import React, { useState, useContext } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { MinUidConsumer } from '../../agora-rn-uikit/src/MinUidContext';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import { MaxVideoView } from '../../agora-rn-uikit/Components';
import { MaxUidConsumer } from '../../agora-rn-uikit/src/MaxUidContext';
import chatContext from '../components/ChatContext';
import Transcript from './transcript';
import SymblTopictooltip from '../subComponents/SymblTopicTooltip';

const PinnedVideo = () => {
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const onLayout = () => {
    setTimeout(() => {
      const { height, width } = Dimensions.get('window');
      const isLandscape = width > height;
      setDim([width, height, isLandscape]);
    }, 20);
  };
  const { userList, localUid } = useContext(chatContext);
  return (
    <View
      style={{ flexDirection: dim[2] ? 'row' : 'column', flex: 1 }}
      onLayout={onLayout}
    >
      <View
        style={
          dim[2]
            ? style.width80
            : Platform.OS === 'web'
            ? style.flex2
            : style.flex4
        }
      >
        <MaxUidConsumer>
          {(maxUsers) => (
            <View style={style.flex1}>
              <MaxVideoView user={maxUsers[0]} key={maxUsers[0].uid} />
              <View style={style.nameHolder}>
                <Text style={style.name}>
                  {maxUsers[0].uid === 'local'
                    ? userList[localUid]
                      ? userList[localUid].name + ' '
                      : 'You '
                    : userList[maxUsers[0].uid]
                    ? userList[maxUsers[0].uid].name + ' '
                    : 'User '}
                </Text>
              </View>
            </View>
          )}
        </MaxUidConsumer>
      </View>
      <ScrollView
        horizontal={dim[2] ? false : true}
        decelerationRate={0}
        // snapToInterval={
        //   dim[2] ? dim[0] * 0.1125 + 2 : ((dim[1] / 3.6) * 16) / 9
        // }
        // snapToAlignment={'center'}
        style={
          dim[2] ? { marginTop: dim[1] * 0.08, width: '20%' } : { flex: 1 }
        }
      >
        <RtcContext.Consumer>
          {(data) => (
            <MinUidConsumer>
              {(minUsers) =>
                minUsers.map((user) => (
                  <TouchableOpacity
                    style={
                      dim[2]
                        ? {
                            width: '100%',
                            height: dim[0] * 0.1125 + 2, // width * 20/100 * 9/16 + 2
                            zIndex: 40,
                          }
                        : Platform.OS === 'web'
                        ? {
                            width: ((dim[1] / 3.6) * 16) / 9, //dim[1] /4.3
                            height: '100%',
                            zIndex: 40,
                          }
                        : {
                            width: ((dim[1] / 3) * 16) / 9 / 2, //dim[1] /4.3
                            height: '100%',
                            zIndex: 40,
                          }
                    }
                    key={user.uid}
                    onPress={() => {
                      data.dispatch({ type: 'SwapVideo', value: [user] });
                    }}
                  >
                    <View style={style.flex1}>
                      <MaxVideoView
                        user={user}
                        key={user.uid}
                        showOverlay={false}
                      />
                      <View style={style.nameHolder}>
                        <Text style={style.name}>
                          {user.uid === 'local'
                            ? userList[localUid]
                              ? userList[localUid].name + ' '
                              : 'You '
                            : userList[user.uid]
                            ? userList[user.uid].name + ' '
                            : 'User '}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </MinUidConsumer>
          )}
        </RtcContext.Consumer>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  width80: { width: '80%' },
  flex2: { flex: 2 },
  flex4: { flex: 4 },
  flex1: { flex: 1 },
  nameHolder: {
    marginTop: -25,
    backgroundColor: '#ffffffbb',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    height: 25,
  },
  name: { color: '#333', lineHeight: 25, fontWeight: '700' },
});

export default PinnedVideo;
