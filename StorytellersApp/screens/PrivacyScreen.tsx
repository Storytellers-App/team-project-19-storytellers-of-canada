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
import { LocalizationContext } from '../LocalizationContext';


export default function PrivacyScreen(props) {
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const openPrivacyPage = async () => {
       WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/gdprportal/index.html');
    }
    const openTOSPage = async () => {
        WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/tos/posts/tos.html');
     }
     const openPrivacyPolicyPage = async () => {
        WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/tos/posts/privacypolicy.html');
     }
    
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={t('privacy')} />
                {/* <Appbar.Action icon="magnify"  />
    <Appbar.Action icon="dots-vertical"  /> */}
            </Appbar.Header>
            <View>
                <TouchableHighlight onPress={openPrivacyPage}>
                    <Card.Title
                        title={t('downloadData')}
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name='shield-account-outline'></Icon>}
                    />
                </TouchableHighlight>
                <Headline style={{marginLeft: 10, marginVertical: 10}}>Legal</Headline>
                <TouchableHighlight onPress={openTOSPage}>
                    <Card.Title
                        title={t('viewTerms')}
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name='security'></Icon>}
                    />
                </TouchableHighlight>
                <TouchableHighlight onPress={openPrivacyPolicyPage}>
                    <Card.Title
                        title={t('viewPrivacy')}
                        style={{ backgroundColor: 'white' }}
                        left={(props) => <Icon size={props.size} name="help-circle-outline"></Icon>}
                    />
                </TouchableHighlight>
            </View>

        </View>
    );

}
