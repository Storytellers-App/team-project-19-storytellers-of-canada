import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import { Card } from "react-native-elements";
import { getStoryById } from "../APICalls";
import styles from "./styles";
import Reactions from "./Reactions";
import Audio from "./Audio";

class Story extends Component<{ storyId: any }> {
  render() {
    const storyObject = getStoryById(this.props.storyId);
    return (
      <Card>
        <View style={styles.storyInfo}>
          <View style={{ flex: 0.3 }}>
            <Image
              style={styles.topImage}
              source={{
                uri: storyObject.image,
              }}
            />
          </View>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.storyTitle}>{storyObject.title}</Text>
            <Text style={styles.storyAuthor}>
              By: {storyObject.author}
            </Text>
            <Text style={styles.storyAuthor}>
              Posted On: {storyObject.date}
            </Text>
          </View>
        </View>
        <Text style={styles.storyDescription}>
          {storyObject.description}
        </Text>
        <Audio storyId={this.props.storyId} />
        <Card.Divider style={styles.storyDivider} />
        <Reactions storyId={this.props.storyId} />
      </Card>
    );
  }
}

export default Story;