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
        <Card.Title>
          <Text style={styles.storyTitle}>{this.storyObject.title}</Text>
        </Card.Title>
        <Image
          style={{width: 'auto', height: 100}}
          resizeMode="cover"
          source={{
            uri: this.storyObject.image,
          }}
        />
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
