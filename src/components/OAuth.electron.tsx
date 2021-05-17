import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {useHistory} from './Router';

const oauth = {
  client_id: $config.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  redirect_uri: `${$config.backEndURL}/oauth/desktop`,
  scope: encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  ),
  state: encodeURIComponent(
    `site=google&backend=${$config.backEndURL}&redirect=${$config.backEndURL}`,
  ),
};

const url = `${oauth.auth_uri}?response_type=code&scope=${oauth.scope}&include_granted_scopes=true&state=${oauth.state}&client_id=${oauth.client_id}&redirect_uri=${oauth.redirect_uri}`;

const Oauth = () => {
  const history = useHistory();
  useEffect(() => {
    console.log('electron OAuth');
    // @ts-ignore
    window.addEventListener(
      'message',
      ({data, origin}: {data: {token: string}; origin: string}) => {
        if (data.token) {
          console.log(data, origin);
          history.push(`/auth-token/${data.token}`);
        }
      },
      false,
    );
    window.open(url, 'modal');
  }, []);
  return <Text>You are being authenticated. Please wait....</Text>;
};
export default Oauth;
