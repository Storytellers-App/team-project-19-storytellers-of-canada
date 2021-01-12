import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
    playbackContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        minHeight: 19 * 2.0,
        maxHeight: 19 * 2.0,
      },
      playbackSlider: {
        alignSelf: "stretch",
        flex: 1,
      },  
})

export default styles;