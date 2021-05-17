import React, {useContext, useState} from 'react';
import {Redirect, useParams} from './Router';
import StorageContext from './StorageContext';
import {Text} from 'react-native';
import useMount from './useMount';

const Authenticated = () => {
  return <Text> Authenticated Successfully! </Text>;
};

const StoreToken = () => {
  const [ready, setReady] = useState(false);
  const {token}: {token: string} = useParams();
  const {setStore} = useContext(StorageContext);
  console.log('store token api', token);

  useMount(() => {
    setStore && setStore((store) => ({...store, token}));
    setReady(true);
  });
  return ready ? <Redirect to={'/'} /> : <Authenticated />;
};

export default StoreToken;
