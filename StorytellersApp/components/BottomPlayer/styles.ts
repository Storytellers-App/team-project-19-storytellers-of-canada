import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#686868',
    width: '100%',
  },
  progress: {
    height: 4,
    backgroundColor: '#006699',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'space-around'
  },
  title: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  artist: {
    color: 'lightgray',
    fontSize: 13,
  },
})

export default styles;