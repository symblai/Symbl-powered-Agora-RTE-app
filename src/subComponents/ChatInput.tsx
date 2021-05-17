import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import ChatContext from '../components/ChatContext';
import ColorContext from '../components/ColorContext';

const ChatInput = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const [message, onChangeMessage] = useState('');
  const {privateActive, selectedUser} = props;
  const {sendMessage, sendMessageToUid} = useContext(ChatContext);
  return (
    <View style={[style.inputView, {borderColor: primaryColor}]}>
      <TextInput
        style={style.chatInput}
        value={message}
        onChangeText={(text) => onChangeMessage(text)}
        onSubmitEditing={() => {
          !privateActive
            ? (sendMessage(message), onChangeMessage(''))
            : (sendMessageToUid(message, selectedUser.uid),
              onChangeMessage(''));
        }}
        placeholder="Type your message.."
        placeholderTextColor="#000"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={style.chatInputButton}
        onPress={() => {
          !privateActive
            ? (sendMessage(message), onChangeMessage(''))
            : (sendMessageToUid(message, selectedUser.uid),
              onChangeMessage(''));
        }}>
        <Text style={style.chatInputButtonText}>
          {!privateActive ? 'G' : 'P'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  inputView: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#099DFD',
  },
  chatInput: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    color: '#000',
    marginLeft: 10,
  },
  chatInputButton: {
    width: 30,
    height: 30,
    borderRadius: 35,
    marginVertical: 'auto',
    alignSelf: 'center',
    marginHorizontal: 10,
    backgroundColor: '#343944',
    display: 'flex',
    justifyContent: 'center',
  },
  chatInputButtonText: {
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default ChatInput;
