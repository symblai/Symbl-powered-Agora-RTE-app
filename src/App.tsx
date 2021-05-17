import React, {useState} from 'react';
import Join from './pages/Join';
import VideoCall from './pages/VideoCall';
import Create from './pages/Create';
import {Router, Route, Switch, Redirect} from './components/Router';
import PrivateRoute from './components/PrivateRoute';
import OAuth from './components/OAuth';
import Navigation from './components/Navigation';
import StoreToken from './components/StoreToken';
import {StorageProvider} from './components/StorageContext';
import GraphQLProvider from './components/GraphQLProvider';
// import JoinPhrase from './components/JoinPhrase';
import {SessionProvider} from './components/SessionContext';
import {SafeAreaView, StatusBar, View} from 'react-native';
import ColorConfigure from './components/ColorConfigure';
import Transcript from "./components/transcript";
import {SendStream}  from "../bridge/rtc/web/SendStream";
import SymblTopics from "./subComponents/SymblTopics";
import SymblTopicTagCloud from "./components/SymblTopicCloud/SymblTopicTagCloud";


const App: React.FC = () => {
  const [phrase, onChangePhrase] = useState('');

  // @ts-ignore
  // @ts-ignore
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar hidden={true} />
      <StorageProvider>
        <GraphQLProvider>
          <Router>
            <SessionProvider>
              <ColorConfigure>
                <Navigation />
                <Switch>
                  <Route exact path={'/'}>
                    <Redirect to={'/join'} />
                  </Route>
                  <Route exact path={'/authenticate'}>
                    {$config.ENABLE_OAUTH ? <OAuth /> : <Redirect to={'/'} />}
                  </Route>
                  <Route path={'/auth-token/:token'}>
                    <StoreToken />
                  </Route>
                  <Route exact path={'/join'}>
                    <Join phrase={phrase} onChangePhrase={onChangePhrase} />
                  </Route>
                  {/* <Route path={'/join/:phrase'}>
                    <JoinPhrase />
                  </Route> */}
                  {$config.ENABLE_OAUTH ? (
                    <PrivateRoute
                      path={'/create'}
                      failureRedirectTo={'/authenticate'}>
                      <Create />
                    </PrivateRoute>
                  ) : (
                    <Route path={'/create'}>
                      <Create />
                    </Route>
                  )}
                  <Route path={'/:phrase'}>

                    <VideoCall />

                  </Route>
                </Switch>
              </ColorConfigure>
            </SessionProvider>
          </Router>
        </GraphQLProvider>
      </StorageProvider>

    </SafeAreaView>
  );
  // return <div> hello world</div>; {/* isn't join:phrase redundant now, also can we remove joinStore */}
};
export default App;
