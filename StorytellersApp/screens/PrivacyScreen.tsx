import * as WebBrowser from 'expo-web-browser';
import React from "react";
import { View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import {
    Appbar,
    Card,
    Headline
} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function PrivacyScreen(props) {

    const openPrivacyPage = async () => {
       WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/gdprportal/index.html');
    }
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title="Privacy" />
                {/* <Appbar.Action icon="magnify"  />
    <Appbar.Action icon="dots-vertical"  /> */}
            </Appbar.Header>
            <View>
                <TouchableHighlight onPress={openPrivacyPage}>
                    <Card.Title
                        title="Download your Data"
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name='shield-account-outline'></Icon>}
                    />
                </TouchableHighlight>
                <Headline style={{marginLeft: 10, marginVertical: 10}}>Legal</Headline>
                <TouchableHighlight>
                    <Card.Title
                        title="View Terms of Service"
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name='security'></Icon>}
                    />
                </TouchableHighlight>
                <TouchableHighlight>
                    <Card.Title
                        title="View Privacy Policy"
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name="help-circle-outline"></Icon>}
                    />
                </TouchableHighlight>
            </View>

        </View>
    );

}
