import React from 'react';
import ColorContext from './ColorContext';

const ColorConfigure: React.FC = (props: any) => {
  const primaryColor = $config.primaryColor;
  console.log(primaryColor);
  return (
    <ColorContext.Provider
      value={{
        primaryColor: primaryColor,
      }}>
      {true ? props.children : <></>}
    </ColorContext.Provider>
  );
};

export default ColorConfigure;
