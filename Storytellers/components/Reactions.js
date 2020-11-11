import React, {Component} from 'react';
import {Text} from 'react-native';

// TBH, building this is gonna be painful
// I'll wait for everyone else
class Reactions extends Component {
  render() {
    return (
      <Text style={{textAlign: 'center'}}>
        COMMENT SECTION FOR STORY #{this.props.storyId}
      </Text>
    );
  }
}

export default Reactions;
