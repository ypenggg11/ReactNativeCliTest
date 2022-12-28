/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
{/* MUST import the TrackPlayer library */}
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);

{/* ALLOW the TrackPlayer to register our created service file */}
TrackPlayer.registerPlaybackService(() => require('./service'));
