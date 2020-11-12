import React from 'react';
import { Image } from 'react-native';




const StoryPlayer = () => (
    <Image
        source={{ uri: 'https://developers.google.com/cast/images/video_basic_layout.png' }}
        style={{
            width: "100%",
            height: 75,
            minHeight: 50,
            flex: 1,
            resizeMode: 'contain',
        }}
    />
)

export default StoryPlayer;