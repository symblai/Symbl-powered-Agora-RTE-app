import {createContext} from 'react';

interface ColorContext {
  primaryColor: any;
}

const ColorContext = createContext((null as unknown) as ColorContext);

export default ColorContext;
