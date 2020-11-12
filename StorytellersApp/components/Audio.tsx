import React, { Component } from "react";
import { Image, View, Text } from "react-native";

// TBH, building this is gonna be painful
// I'll wait for everyone else
class Audio extends Component<{ storyId: any }> {
  render() {
    return (
      <Image
        source={{
          uri:
            "https://developers.google.com/cast/images/video_basic_layout.png",
        }}
        style={{
          minHeight: 50,
          flex: 1,
          resizeMode: "contain",
          marginBottom: 15,
        }}
      />
    );
  }
}

export default Audio;
