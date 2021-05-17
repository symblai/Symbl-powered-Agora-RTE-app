import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ChatContext, {channelMessage} from '../components/ChatContext';
import ColorContext from '../components/ColorContext';

const ChatBubble = (props: channelMessage) => {
  const {userList} = useContext(ChatContext);
  const {primaryColor} = useContext(ColorContext);
  let {type, msg, ts, uid} = props;
  let time = new Date(ts).getHours() + ':' + new Date(ts).getMinutes();
  return (
    <View>
      <View style={type ? style.chatSenderViewLocal : style.chatSenderView}>
        <Text style={type ? style.timestampTextLocal : style.timestampText}>
          {userList[uid] ? userList[uid].name : 'User'} | {time + ' '}
        </Text>
      </View>
      <View
        style={
          type
            ? [style.chatBubbleLocal, {backgroundColor: primaryColor}]
            : style.chatBubble
        }>
        <Text style={type ? style.whiteText : style.blackText}>
          {msg.slice(1) + ' '}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  full: {
    flex: 1,
  },
  chatSenderViewLocal: {
    flex: 2,
    marginVertical: 2,
    flexDirection: 'row',
    marginRight: 15,
    // marginLeft: 30,
    justifyContent: 'flex-end',
  },
  chatSenderView: {
    flex: 2,
    marginVertical: 2,
    flexDirection: 'row',
    marginRight: 30,
    marginLeft: 15,
  },
  timestampText: {
    color: '#C1C1C1',
    fontWeight: '500',
    fontSize: 12,
    flex: 1,
    // textAlign: 'right',
  },
  timestampTextLocal: {
    color: '#C1C1C1',
    fontWeight: '500',
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  chatBubble: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    // width: 'max-content',
    // maxWidth: '90%',
    alignSelf: 'flex-start',
    display: 'flex',
    marginVertical: 5,
    padding: 8,
    marginRight: 30,
    marginLeft: 15,
  },
  chatBubbleLocal: {
    backgroundColor: '#099DFD',
    flex: 1,
    display: 'flex',
    alignSelf: 'flex-end',
    marginVertical: 5,
    padding: 8,
    marginRight: 15,
    marginLeft: 30,
  },
  whiteText: {
    color: '#fff',
    fontWeight: '500',
  },
  blackText: {
    color: '#000',
    fontWeight: '500',
  },
});

export default ChatBubble;
