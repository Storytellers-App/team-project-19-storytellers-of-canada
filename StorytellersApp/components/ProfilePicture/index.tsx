import React from 'react';
import { Image } from 'react-native';
export type ProfilePictureProps = {
    image?: string, //temporarily optional
    size?: number,
}

const ProfilePicture = ({ image, size =40 }: ProfilePictureProps) => (
    <Image
        source={{ uri: image }}
        style={{
            width: size,
            height: size,
            borderRadius: size,
            overlayColor: 'white',
        }}
    />
)

export default ProfilePicture;