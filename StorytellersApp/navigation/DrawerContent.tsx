import React, { Component, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { UserType, RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions } from 'react-native-router-flux';
import { UserContext } from '../UserContext';

export function DrawerContent(props) {

    const {user, setUser} = React.useContext(UserContext)

    // Signout function
    async function signOut(){
        await AsyncStorage.setItem("username", "")
        await AsyncStorage.setItem("name", "")
        await AsyncStorage.setItem("email", "")
        await AsyncStorage.setItem("authToken", "")
        await AsyncStorage.setItem("type", "")
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

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: "https://ui-avatars.com/api/?background=006699&color=fff&name=" + user?.name
                                }}
                                size={120}
                            />
                            <View style={{ marginTop: 20 }}>
                                <Title style={styles.title}>{user?.name}</Title>
                                <Caption style={styles.caption}>{user?.email}</Caption>
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
                            label="Home"
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
                            label="Profile"
                            onPress={() => { props.navigation.navigate('ProfilePage') }}
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
                    label="Sign Out"
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