/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
WebFont.load({
    google: {
        families: ['Titillium Web:300,400,700', 'sans-serif','Limelight', 'Roboto']
    }
});

AppRegistry.registerComponent(appName, () => App);
