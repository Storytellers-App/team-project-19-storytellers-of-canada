import axios from 'axios';
import React, { useState } from 'react';
import {
    View
} from 'react-native';
import {
    IconButton
} from 'react-native-paper';
import { HOST } from '../../config';
import { ResponseType, UserType } from '../../types';
import styles from './styles';
export type UserStoryProps = {
    story: ResponseType,
    user: UserType | undefined | null,
}
let url = HOST

const AdminFooter = (props: UserStoryProps) => {


    const [approved, setApproved] = useState<boolean | null>(null);
    const { user } = props;


    const approve = async () => {
        try {
            axios({
                method: 'post', url: url + 'admin', data: {
                    id: props.story.id,
                    auth_token: user?.authToken,
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
                    auth_token: user?.authToken,
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