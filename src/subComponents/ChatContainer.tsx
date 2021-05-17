import React, {useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import ChatBubble from './ChatBubble';
import ChatContext from '../components/ChatContext';
import icons from '../assets/icons';

const ChatContainer = (props: any) => {
  const {selectedUser, privateActive, setPrivateActive, selectedUsername} = props;
  const {messageStore, localUid, privateMessageStore} = useContext(ChatContext);
  return (
    <View style={style.containerView}>
      {privateActive ? (
        <View style={style.row}>
          <TouchableOpacity
            style={style.backButton}
            onPress={() => setPrivateActive(false)}>
            <Image
              resizeMode={'contain'}
              style={style.backIcon}
              source={{uri: icons.backBtn}}
            />
          </TouchableOpacity>
          <Text style={style.name}>{selectedUsername}</Text>
        </View>
      ) : (
        <></>
      )}
      <ScrollView>
        {!privateActive ? (
          messageStore.map((message: any) => {
            return (
              <ChatBubble
                type={localUid === message.uid ? 1 : 0}
                msg={message.msg}
                ts={message.ts}
                uid={message.uid}
                key={message.ts}
              />
            );
          })
        ) : privateMessageStore[selectedUser.uid] ? (
          privateMessageStore[selectedUser.uid].map((message: any) => {
            return (
              <ChatBubble
                type={localUid === message.uid ? 1 : 0}
                msg={message.msg}
                ts={message.ts}
                uid={message.uid}
                key={message.ts}
              />
            );
          })
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  containerView: {flex: 8},
  row: {flexDirection: 'row', marginTop: 5},
  backButton: {
    marginLeft: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: Platform.OS === 'web' ? '500' : '700',
    marginLeft: 10,
    color: '#333',
  },
  backIcon: {
    width: 20,
    height: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: '#333',
  },
});
export default ChatContainer;
