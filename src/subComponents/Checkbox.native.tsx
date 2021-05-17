import React, { useContext } from 'react';
import CheckBox from '@react-native-community/checkbox';
import ColorContext from '../components/ColorContext';

const Checkbox = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const urlCheckbox = props.value;
  const setUrlCheckbox = props.onValueChange;
  return (
    <CheckBox
      value={urlCheckbox}
      onValueChange={setUrlCheckbox}
      tintColors={{
        true: primaryColor ? primaryColor : '#099DFD',
        false: primaryColor ? primaryColor : '#099DFD',
      }}
    />
  );
};
export default Checkbox;
