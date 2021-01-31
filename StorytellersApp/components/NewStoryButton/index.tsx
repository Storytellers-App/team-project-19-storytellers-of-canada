import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { LocalizationContext } from '../../LocalizationContext';
import { ResponseType, RootStackParamList, UserType } from '../../types';

export type Props = {
    recording: string | null;
    user: UserType,
    parent?: ResponseType;
    time: number | null;
};

const NewStoryButton = ({ recording, user, parent, time }: Props) => {
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = async () => {

        navigation.navigate("NewStory", { 'recording': recording, 'user': user, 'parent': parent,});

    }
    return (

        <TouchableHighlight
            style={styles.submitButton}
            onPress={onPress}
            disabled={recording === null}
        >
            <Text
                style={styles.text}>
                {t('next')}
                    </Text>
        </TouchableHighlight>

    )
}

export default NewStoryButton;


const styles = StyleSheet.create({
    submitButton: {
        backgroundColor: Colors.light.tint,
        borderRadius: 30,
    },
    text: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },

});