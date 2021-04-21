import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import * as React from "react";
import { memo } from "react";
import {
  Alert,
  Image,
  TouchableWithoutFeedback, View
} from "react-native";
import {
  Card,
  Divider, IconButton, Menu, Text
} from "react-native-paper";
import useColorScheme from "../../hooks/useColorScheme";
import { ResponseType, RootStackParamList, StorySaveType, UserType } from "../../types";
import AdminFooter from "../AdminFooter";
import AudioPlayer from "../AudioPlayer";
import Footer from "../CardFooter";
import Tags from "../Tags";
import { LocalizationContext } from '../../LocalizationContext';
import styles from "./styles";
import axios from "axios";
import { HOST } from '../../config';
export type StoredStoryProps = {
  story: StorySaveType;
  admin?: boolean;
  user: UserType | undefined | null;
  disableResponse?: boolean;
};

function SavedStory(props: StoredStoryProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const responseScreen = (header: ResponseType) => {
    navigation.push("StoryResponse", { header: header });
  };
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const colorScheme = useColorScheme();
  const Controls = () => {
    if (props.admin == true) {
      return <AdminFooter story={props.story} user={props.user}></AdminFooter>;
    }
    else {
      return <Footer story={props.story} user={props.user} ></Footer>;
    }
  }
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const submitFlag = async () => {
    try {
      setLoading(true);

      axios({
        method: 'post', url: HOST + 'flag', data: {
          id: props.story.id,
          type: props.story.type,
          auth_token: props.user?.authToken,
        }
      })
        .then(response => {
          setLoading(false);
          setMenuOpen(false);
          Alert.alert(t('flagSentForReview'));
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setMenuOpen(false);
        });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  return (
    <Card style={styles.card}>
      <TouchableWithoutFeedback
        onPress={() => {
          responseScreen(props.story);
        }}
        disabled={props.disableResponse == true ? props.disableResponse : false}
      >
        <View>
          <View style={[styles.row, styles.attribution]}>

            <View style={{ flex: 1 }}>
              <Text style={styles.titleStyle}>{props.story.title} </Text>

              <View style={styles.userRow}>
                <Text style={styles.name}>By: {props.story.author}</Text>
                <Text style={styles.createdAt}>
                  {moment(props.story.creationTime).fromNow()}
                </Text>
              </View>
            </View>

            <View style={{ marginRight: -15 }}>
              <Menu
                visible={menuOpen}
                onDismiss={() => setMenuOpen(false)}
                anchor={<IconButton size={23} icon="dots-vertical" onPress={() => setMenuOpen(true)} />}>
                <Menu.Item icon='flag' onPress={() => submitFlag()} title="Flag Post" />
              </Menu>
            </View>

          </View>
          <Card.Content style={styles.content}>
            {!!props.story.image && <Image
              style={styles.topImage}
              source={{
                uri: props.story.image,
              }}
            />}
            <Text style={{ marginBottom: 15 }}>{props.story.description}</Text>
            <AudioPlayer newStory={props.story}></AudioPlayer>
          </Card.Content>
        </View>
      </TouchableWithoutFeedback>
      <Tags tags={props.story.tags}></Tags>
      <Divider />
      <Controls ></Controls>
    </Card>
  );
}

export default memo(SavedStory);
