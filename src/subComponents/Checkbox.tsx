import React, { useContext } from 'react';
import {CheckBox} from 'react-native';
import ColorContext from '../components/ColorContext';

const Checkbox = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const urlCheckbox = props.value;
  const setUrlCheckbox = props.onValueChange;
  return (
    <CheckBox
      value={urlCheckbox}
      onValueChange={setUrlCheckbox}
      color={primaryColor ? primaryColor : '#099DFD'}
      style={{width: 35, height: 35}}
    />
  );
};

export default Checkbox;
