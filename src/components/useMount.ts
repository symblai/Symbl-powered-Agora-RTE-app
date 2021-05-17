import {useEffect} from 'react';

const useMount = (effect: () => (() => void) | void) => {
  useEffect(effect, []);
};

export default useMount;
