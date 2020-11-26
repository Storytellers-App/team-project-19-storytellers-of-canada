import { StyleSheet } from 'react-native'
import { MenuOption } from 'react-native-popup-menu';

const styles = StyleSheet.create({
    input: {
        padding: 16,
        backgroundColor: 'transparent',
        margin: 0,
    },
    card: {
        marginVertical: 8,
        borderRadius: 0,
    },
    cover: {
        height: 160,
        borderRadius: 0,
    },
    content: {
        marginBottom: 12,
    },
    attribution: {
        margin: 12,
    },
    author: {
        marginHorizontal: 15,
    },
    titleStyle: {
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 20,
    },
    dateStyle: {
        alignItems: 'flex-end'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
    },
    icon: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    replyOption: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    userRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    replyMenu : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    }
});

export default styles;