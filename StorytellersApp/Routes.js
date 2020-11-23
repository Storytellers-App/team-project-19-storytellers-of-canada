import React, { Component } from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import Navigation from './navigation';
import AdminNavigation from './admin-navigation';
import RadioPlayer from './screens/RadioPlayer';
import NewRecordingScreen from './screens/NewRecordingScreen';
import NewStoryScreen from './screens/NewStoryScreen';

/**
 * Class for routing between components/screens
 */
export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="LoginScreen" component={LoginScreen} title="LoginScreen" initial={true}/>
                    <Scene key="RegisterScreen" component={RegisterScreen} title="RegisterScreen" />
                    <Scene key="HomeScreen" component={Navigation} title="HomeScreen" />
                    <Scene key="AdminScreen" component={AdminNavigation} title="AdminScreen" />
                    <Scene key="RadioPlayer" component={RadioPlayer} title="RadioPlayer" />
                    <Scene key="NewRecording" component={NewRecordingScreen} title="NewRecording"/>
                    <Scene key="NewStory" component={NewStoryScreen} title="NewStory"/>
                </Stack>
            </Router>
        );
    }
}