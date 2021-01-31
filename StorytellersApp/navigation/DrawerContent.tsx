import * as SecureStore from 'expo-secure-store';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
    Avatar,
    Caption,
    Drawer, Title
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../UserContext';
import { LocalizationContext } from '../LocalizationContext';

export function DrawerContent(props) {
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const {user, setUser} = React.useContext(UserContext)

    // Signout function
    async function signOut(){
        await SecureStore.deleteItemAsync("authToken")
        let newUser = undefined;
        setUser(newUser)
        props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Login' },
              ],
            })
          ); 
    } 
    const goToProfile = () => {
        if (user === undefined || user === null || user.username === "") {
            Alert.alert(t('pleaseLoginToViewProfile'));
            return;
        }
        props.navigation.navigate('ProfilePage') 
    }
    const goToPrivacy = () => {
        props.navigation.navigate('Privacy') 
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: user?.image === undefined || user?.image === null || user.image === "" ? 'https://ui-avatars.com/api/?background=006699&color=fff&name=' + user?.name : user?.image
                                }}
                                size={120}
                            />
                            <View style={{ marginTop: 20 }}>
                                <Title style={styles.title}>{user === undefined || user === null ? t('guestUser') : user?.name}</Title>
                                {user != null && user != undefined && <Caption style={styles.caption}>{user?.email}</Caption>}
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={t('home')}
                            onPress={() => { props.navigation.navigate('Home') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={t('profile')}
                            onPress={goToProfile}
                        />
                         <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="shield-lock-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={t('privacy')}
                            onPress={goToPrivacy}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color='red'
                        size={size}
                        />
                    )}
                    label={t('signOut')}
                    labelStyle = {{color:'red'}}
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        marginLeft: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,     
    },
    bottomDrawerSection: {
        marginBottom: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});