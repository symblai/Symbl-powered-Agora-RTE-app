import React, {useEffect} from 'react';
import {Text, Platform, Linking} from 'react-native';

import InAppBrowser from 'react-native-inappbrowser-reborn';
import {useHistory} from './Router';

const oauth = {
  client_id: $config.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  redirect_uri: `${$config.backEndURL}/oauth/mobile`,
  scope: encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  ),
  state: encodeURIComponent(
    `site=google&backend=${$config.backEndURL}&redirect=${$config.backEndURL}`,
  ),
};

const url = `${oauth.auth_uri}?response_type=code&scope=${oauth.scope}&include_granted_scopes=true&state=${oauth.state}&client_id=${oauth.client_id}&redirect_uri=${oauth.redirect_uri}`;
const processUrl = (url: string): string => {
  return url
    .replace(`${$config.projectName.toLowerCase()}://my-host`, '')
    .replace($config.frontEndURL, '');
};

const Oauth = () => {
  let history = useHistory();

  useEffect(() => {
    console.log('mobile OAuth in ', Platform.OS);

    const openLink = async () => {
      try {
        // const url = `https://deep-link-tester.netlify.app`;
        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.openAuth(url, url);
          console.log(JSON.stringify(result));
          if (result.type === 'success') {
            console.log('success', Linking.canOpenURL(result.url));
            history.push(processUrl(result.url));
          }
        } else {
          Linking.openURL(url);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    openLink();
  }, []);

  return <Text>You are being authenticated. Please wait....</Text>;
};
export default Oauth;
