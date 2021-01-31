import React from 'react';
import { Image } from 'react-native';
import {
    Avatar,
} from 'react-native-paper';
export type ProfilePictureProps = {
    image?: string, //temporarily optional
    size?: number,
    name?: string,
}

const ProfilePicture = ({ image, size = 40, name }: ProfilePictureProps) => {

    const extractInitials = (name: string | undefined) => {
        if (name === undefined || name === null || name === "") {
            return "G";
        }
        let names = name.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;

    }
    if (image !== null && image !== undefined) {
        return <Avatar.Image style={{ overflow: 'hidden' }} source={{
            uri: image
        }}
            size={size} />
    }

    return (
        <Avatar.Text color={'white'} style={{ overflow: 'hidden', backgroundColor: '#006699' }} size={size} label={extractInitials(name)} />
    )
}

export default ProfilePicture;