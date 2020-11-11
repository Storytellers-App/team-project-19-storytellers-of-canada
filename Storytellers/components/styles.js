import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  storyTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  storyAuthor: {
    fontSize: 14,
    textAlign: 'center',
  },
  storyDescription: {
    margin: 15,
    fontSize: 12,
  },
  storyDivider: {
    height: 2,
  },
  topImage: {
    flex: 1,
    resizeMode: 'contain',
    height: null,
    width: null,
    minHeight: 70,
  },
  storySaveTitle: {
    color: Colors.dark,
    fontSize: 30,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  storySaveHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    minHeight: 100,
  },
  storyInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
    padding: 0,
  },
});

export default styles;
