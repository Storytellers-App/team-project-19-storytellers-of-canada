import React, {Component} from 'react';
import {Text} from 'react-native';
import {Card} from 'react-native-elements';
import {getStoryById} from '../APICalls';
import styles from './styles';

class Story extends Component {
  render() {
    this.storyObject = getStoryById(this.props.storyId);
    return (
      <Card key={'SavedStoryListItem:' + this.storyObject.id}>
        <Card.Title>
          <Text style={styles.footer}>{this.storyObject.title}</Text>
        </Card.Title>
      </Card>
    );
  }
}

export default Story;
