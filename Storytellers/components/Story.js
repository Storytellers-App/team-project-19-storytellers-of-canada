import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {Card} from 'react-native-elements';
import {getStoryById} from '../APICalls';
import styles from './styles';
import Reactions from './Reactions';

class Story extends Component {
  render() {
    this.storyObject = getStoryById(this.props.storyId);
    return (
      <Card>
        <View style={styles.storyInfo}>
          <View style={{flex: 0.3}}>
            <Image
              style={styles.topImage}
              source={{
                uri: this.storyObject.image,
              }}
            />
          </View>
          <View style={{flex: 0.7}}>
            <Text style={styles.storyTitle}>{this.storyObject.title}</Text>
            <Text style={styles.storyAuthor}>
              By: {this.storyObject.author}
            </Text>
            <Text style={styles.storyAuthor}>
              Posted On: {this.storyObject.date}
            </Text>
          </View>
        </View>
        <Text style={styles.storyDescription}>
          {this.storyObject.description}
        </Text>
        <Card.Divider style={styles.storyDivider} />
        <Reactions />
      </Card>
    );
  }
}

export default Story;
