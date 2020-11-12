import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import styles from "./styles";
import { getStoriesByCategory } from "../APICalls";
import Story from "./Story";

class StorySave extends Component {
  render() {
    return (
      <View>
        <View style={styles.storySaveHeader}>
          <View style={{ flex: 0.4 }}>
            <Image
              style={styles.topImage}
              source={{
                uri:
                  "https://images.669pic.com/element_min_new_pic/22/30/24/59/e159482b59b7e920efe5a14140aaf28b.png",
              }}
            />
          </View>
          <View style={{ flex: 0.6 }}>
            <Text style={styles.storySaveTitle}>Saved Story Collection</Text>
          </View>
        </View>

        {getStoriesByCategory("dogs").map((i: any) => (
          <Story key={"SavedStoryListItem:" + i} storyId={i} />
        ))}
      </View>
    );
  }
}

export default StorySave;
