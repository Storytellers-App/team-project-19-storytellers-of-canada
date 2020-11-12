import React, { Component } from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import Navigation from './navigation';

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
                </Stack>
            </Router>
        );
    }
}