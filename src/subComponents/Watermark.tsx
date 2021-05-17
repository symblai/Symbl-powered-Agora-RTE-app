import React from 'react';
import {Image} from 'react-native';

const Watermark = () => {
  return (
    // <View>
    <Image
      source={{uri: $config.logo}}
      style={{
        position: 'absolute',
        bottom: '2%',
        left: '3%',
        width: 90,
        height: 30,
        zIndex: 100,
        opacity: 0.5,
      }}
      resizeMode="contain"
    />
  );
};

export default Watermark;
