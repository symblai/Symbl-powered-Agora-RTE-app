import React from 'react';
import {Image} from 'react-native';

const Illustration = () => {
  return (
    <Image
      style={{flex: 1}}
      resizeMode={'contain'}
      source={{
        uri:
          $config.illustration === ''
            ? 'https://gist.githubusercontent.com/EkaanshArora/59ae6969456f8e95f9752a4adf96bb44/raw/4c3831d115b4f9de0219e8658f049927b0ed9271/image.svg'
            : $config.illustration,
      }}
    />
  );
};

export default Illustration;
