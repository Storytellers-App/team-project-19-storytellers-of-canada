import { StyleSheet} from "react-native";
import * as Icons from "../../components/Icons";
const styles = StyleSheet.create({
    playbackContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        minHeight: Icons.THUMB_1.height * 2.0,
        maxHeight: Icons.THUMB_1.height * 2.0,
      },
      playbackSlider: {
        alignSelf: "stretch",
        flex: 1,
      },  
})

export default styles;