import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './styles';
import {getStoriesByCategory} from '../APICalls';
import Story from './Story';

class StorySave extends Component {
  render() {
    return (
      <View>
        <View style={styles.storySaveHeader}>
          <View style={{flex: 0.4}}>
            <Image
              style={styles.topImage}
              source={require('../img/storytellingclipart.png/')}
            />
          </View>
          <View style={{flex: 0.6}}>
            <Text style={styles.storySaveTitle}>Saved Story Collection</Text>
          </View>
        </View>

        {getStoriesByCategory('dogs').map((i) => (
          <Story key={'SavedStoryListItem:' + i} storyId={i} />
        ))}
      </View>
    );
  }
}

export default StorySave;
