import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    ScrollViewProps,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserStoryType, ResponseType } from '../../types';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { HOST } from '../../config'
export type UserStoryProps = {
    story: ResponseType,
}
let url = HOST

const AdminFooter = (props: UserStoryProps) => {


    const [approved, setApproved] = useState<boolean | null>(null);



    const approve = async () => {
        try {
            axios({
                method: 'post', url: url + 'admin', data: {
                    id: props.story.id,
                    approved: true,
                    parent_type: props.story.parentType === undefined ? null : props.story.parentType,
                    type: props.story.type
                }

            })
                .then(response => {
                    setApproved(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const disapprove = async () => {
        try {
            axios({
                method: 'post', url: url + 'admin', data: {
                    id: props.story.id,
                    approved: false,
                    parent_type: props.story.parent === undefined ? null : props.story.parent.type,
                    type: props.story.type
                }

            })
                .then(response => {
                    setApproved(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.iconcontainer}>
            <View style={styles.icon}>
                <IconButton size={16} icon={approved ? "thumb-up" : "thumb-up-outline"} onPress={approve} color={'green'} />
            </View>
            <View style={styles.icon}>
                <IconButton size={16} icon={approved === false ? "thumb-down" : "thumb-down-outline"} onPress={disapprove} color={'red'} />
            </View>

        </View>
    );
};

export default AdminFooter;