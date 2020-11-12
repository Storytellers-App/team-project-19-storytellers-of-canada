import React from 'react'
import { View, FlatList } from 'react-native';

import userstories from '../../data/userstoriestest';
import UserStory from '../UserStory';
const Feed = () => (
    <FlatList
        data={userstories}
        renderItem={({ item }) => <UserStory story={item} />}
        keyExtractor={item => item.id.toString()}
    />
)

export default Feed;