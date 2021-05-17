import React, {useContext} from 'react';
import {useParams} from './Router';
import SessionContext from './SessionContext';

const JoinPhrase = () => {
  const {phrase} = useParams();
  const {joinSession} = useContext(SessionContext);
  console.log({phrase});
  joinSession({phrase});
  return <></>;
};

export default JoinPhrase;
