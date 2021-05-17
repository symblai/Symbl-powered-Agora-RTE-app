import React, {useContext} from 'react';
import {Image, TouchableOpacity, StyleSheet, Platform, View, Text} from 'react-native';
import icons from '../assets/icons';
import RtcContext from '../../agora-rn-uikit/src/RtcContext';
import PropsContext from '../../agora-rn-uikit/src/PropsContext';
import ColorContext from '../components/ColorContext';
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import {MinUidConsumer} from "../../agora-rn-uikit/src/MinUidContext";
import {MaxUidConsumer} from "../../agora-rn-uikit/src/MaxUidContext";


const SymblButton = (props: any) => {
    const {primaryColor} = useContext(ColorContext);

    let toggle=false;


    return (
        <TouchableOpacity
            style={style.localButton}
            onPress={() => {
                toggle=!toggle;


            }}>
            <Image
                source={{
                    uri: icons.screenshareIcon,
                }}
                style={[style.buttonIcon, {tintColor: primaryColor}]}
                resizeMode={'contain'}
            />
            {
                toggle?(
                        <View style={Platform.OS === 'web' ? style.chatView : style.chatViewNative} >
                            <View style={style.heading}>
                                <TouchableOpacity
                                    style={style.backButton}
                                    onPress={() => toggle=false}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={style.backIcon}
                                        source={{uri: icons.backBtn}}
                                    />
                                    <Text style={style.headingText}>Chats</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ):
                    (<></>)
            }
        </TouchableOpacity>

    );
};

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
    }
});

export default SymblButton;
