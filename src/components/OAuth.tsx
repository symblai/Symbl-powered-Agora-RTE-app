import React from 'react';
import {Linking} from 'react-native';

const oauth = {
  client_id: $config.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  redirect_uri: `${$config.backEndURL}/oauth/web`,
  scope: encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  ),
  state: encodeURIComponent(
    `site=google&backend=${$config.backEndURL}&redirect=${window.location.origin}/auth-token/`,
  ),
};

const url = `${oauth.auth_uri}?response_type=code&scope=${oauth.scope}&include_granted_scopes=true&state=${oauth.state}&client_id=${oauth.client_id}&redirect_uri=${oauth.redirect_uri}`;

const Oauth = () => {
  Linking.openURL(url);
  return <></>;
};
export default Oauth;
