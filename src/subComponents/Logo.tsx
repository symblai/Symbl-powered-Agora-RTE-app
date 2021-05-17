import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {useHistory} from '../components/Router';
import icons from "../assets/icons";

export default function Logo() {
  const history = useHistory();

  return (
    <TouchableOpacity onPress={() => history.replace('/')}>
      <Image
        source={{uri: icons.symblLogo}}
        style={{
          width: 110,
          height: 50,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
