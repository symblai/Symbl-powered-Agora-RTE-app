import React, {createContext, ReactChildren, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import useMount from './useMount';
//import SymblContext from '../../bridge/rtc/web/useSymblContext';
interface StoreInterface {
  token: null | string;
}

interface StorageContextInterface {
  store: StoreInterface;
  setStore: React.Dispatch<React.SetStateAction<StoreInterface>> | null;
}

const initStoreValue: StoreInterface = {
  token: null,
};

const initStorageContextValue = {
  store: initStoreValue,
  setStore: null,
};

const StorageContext = createContext<StorageContextInterface>(
  initStorageContextValue,
);

export default StorageContext;

export const StorageConsumer = StorageContext.Consumer;

export const StorageProvider = (props: {children: React.ReactNode}) => {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<StoreInterface>(initStoreValue);
  //const [closedCaption,setClosedCaption]=useState(SymblContext);

  // Initialize and hydrate store
  useMount(() => {
    const hydrateStore = async () => {
      try {
        const storeString = await AsyncStorage.getItem('store');
        if (storeString === null) {
          await AsyncStorage.setItem('store', JSON.stringify(initStoreValue));
          setReady(true);
        } else {
          setStore(JSON.parse(storeString));
          setReady(true);
        }
        console.log('store hydrated', storeString);
        setReady(true);
      } catch (e) {
        console.error('problem hydrating store', e);
      }
    };
    hydrateStore();
  });

  // Sync store with the context
  useEffect(() => {
    const syncStore = async () => {
      try {
        await AsyncStorage.setItem('store', JSON.stringify(store));
        console.log('store synced with value', store);
      } catch (e) {
        console.log('problem syncing the store', e);
      }
    };
    ready && syncStore();
  }, [store, ready]);
  return (
    <StorageContext.Provider value={{store, setStore}}>
      {ready ? props.children : <></>}
    </StorageContext.Provider>
  );
};
