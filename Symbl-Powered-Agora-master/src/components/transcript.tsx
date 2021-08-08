import React, { useCallback, useEffect, useState, useContext } from 'react';
import { cci } from '../../bridge/rtc/web/SendStream';
import {
  View,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

//import useSymblContext from '../../bridge/rtc/web/useSymblContext';
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      textAlign: 'center',
      bottom: 50,
      position: 'absolute',
      width: '100%',
      zIndex: 1000,
      height: '9.8em',
      overflow: 'hidden',
    },
    paper: {
      padding: 12,
      width: 'fit-content',
      border: 'none',
      alignItems: 'center',
      display: 'inline-block',
      backgroundColor: 'rgb(0,0,0, 0)',
      zIndex: 1000,
      maxWidth: '60vw',
    },
    caption: {
      fontWeight: 600,
      fontSize: '2vh',
      color: '#fefefe',
      textShadow: '2px 2px #1A1A1A',
    },
  }),
);

const text = 'hi';

const getContent = (data = {}) => {
  const { punctuated, payload } = data;
  if (punctuated && punctuated.transcript) {
    console.log();
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

const symbl = null;

export function transcript(props) {
  //const {closedCaptionResponse} = useSymblContext();
  const classes = useStyles();
  /*const {closedCaptionResponse} = useSymblContext()
    const text1 = getContent(closedCaptionResponse);*/

  useEffect(() => {
    console.log(JSON.stringify(props));
  }, [props]);

  const [text, setText] = useState('');
  useEffect(() => {
    setText(cci);
    console.log('inside transcript' + cci);
  }, [cci]);

  return (
    <View style={{ width: 400 }}>
      <div
        className={classes.container}
        style={{
          marginBottom: 40,
          marginRight: 250,
          marginLeft: 300,
          width: 800,
          height: 100,
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
          position: 'absolute',
        }}
      >
        <span id="tes1">{JSON.stringify(props.closedCaption)}</span>
        <Paper variant={'outlined'} className={classes.paper}>
          <Typography
            id="tes"
            variant={'caption'}
            className={classes.caption}
            style={{ backgroundColor: 'black', padding: 0 }}
          />
        </Paper>
      </div>
    </View>
  );
}

/*
    return (
        <View>
            <Text style={style.participantText}>
            {
                //closedCaptionResponse
                <input type="text" onChange={handleInputChange} value={text} />

            }
            </Text>
        </View>
    );
};*/

const style = StyleSheet.create({
  participantButtonContainer: {
    // flex: 0.3,
    flexDirection: 'row',
    paddingRight: 350,
    paddingLeft: 350,
    alignSelf: 'center',
    alignItems: 'center',
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

  participantText: {
    flex: 1,
    fontSize: 18,
    fontWeight: Platform.OS === 'web' ? '500' : '700',
    flexDirection: 'row',
    color: '#333',
    lineHeight: 20,
    paddingLeft: 10,
    alignSelf: 'center',
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
  container: {
    textAlign: 'center',
    bottom: 50,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
    height: '6.8em',
    overflow: 'hidden',
    // maxWidth: 'min-content'
  },
  paper: {
    padding: 12,
    width: 'fit-content',
    border: 'none',
    alignItems: 'center',
    display: 'inline-block',
    backgroundColor: 'rgb(0,0,0, 0)',
    zIndex: 1000,
    maxWidth: '60vw',
  },
  caption: {
    fontWeight: 600,
    fontSize: '3vh',
    color: '#fefefe',
    textShadow: '2px 2px #1A1A1A',
  },
  span: {
    width: 50,
  },
});

export default transcript;
