import * as React from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    ScrollViewProps,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
    Chip
} from 'react-native-paper';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';


export type TagProps = {
    tags: string[],
}
import Footer from '../CardFooter';
import { FlatList } from 'react-native-gesture-handler';

const color = ['#66CCFF', '#1C9379', '#8A7BA7'];
const randomColor = () => {
    let col = color[Math.floor(Math.random() * color.length)];
    return col;
};

function Tags(props: TagProps) {
    const colorScheme = useColorScheme();
    return (
        <View style={{marginBottom: 10}}>
        <FlatList
            horizontal={true}
            data={props.tags}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Chip 
            textStyle={{ color:'white',fontSize: 15 }}
            style={{marginHorizontal: 5, backgroundColor: randomColor()}}>{item}</Chip>}
            keyExtractor={item => item.toString()}
        />
        </View>
    );
}
export default Tags;
