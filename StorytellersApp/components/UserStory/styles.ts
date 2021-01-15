
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    input: {
        padding: 16,
        backgroundColor: 'transparent',
        margin: 0,
    },
    card: {
        marginVertical: 8,
        borderRadius: 0,
        backgroundColor: 'white'
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
    titleStyle: {
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 20,
        flexWrap: 'wrap'
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
    userRow: {
        flexDirection: 'row',
    },
    name: {
        marginLeft: 15,
        marginRight: 5,
        color: 'grey',
    },
    username: {
        marginRight: 5,
        color: 'grey',
    },
    createdAt: {
        marginLeft: 5,
        marginRight: 5,
        color: 'grey',
    },
    topImage: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        height: 175,
        borderRadius: 10,
        marginBottom: 5,
        overflow: 'hidden',
    },
});

export default styles;