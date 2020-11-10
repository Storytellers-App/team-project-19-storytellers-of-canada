import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {getStoriesByCategory} from '../APICalls';
import Story from './Story';

class StorySave extends Component {
  render() {
    return (
      <View>
        <Text style={styles.highlight}> StorySave</Text>
        {getStoriesByCategory('dogs').map((i) => (
          <Story key={'SavedStoryListItem:' + i} storyId={i} />
        ))}
      </View>
    );
  }
}

export default StorySave;
