import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, ImageBackground, Text, View } from 'react-native';
import * as Config from '../../config';
import { LocalizationContext } from '../../LocalizationContext';
import { StorySaveType, UserType } from "../../types";
import SavedStory from '../SavedStory';
import styles from "./styles";
import storySaveSplash from "../../assets/images/storysavesplash.png";


let url = Config.HOST
type Props = {
  key: string;
  search: string;
  scrollRef: any;
  user: UserType | null | undefined;
}
type State = {
  stories: StorySaveType[],
  page: number,
  loading: boolean,
  sessionStart: string
};
export default class StorySave extends Component<Props, State> {
  static contextType = LocalizationContext;
  private search: string;
  private user: UserType | null | undefined;
  private scrollRef: any;
  constructor(props: Props) {
      super(props);
      this.search = props.search;
      this.user = props.user;
      this.scrollRef = props.scrollRef;
      this.state = {
          stories: [] as StorySaveType[],
          page: 1,
          loading: true,
          sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
      };
  };


  fetchStories = async () => {
    const { page } = this.state;
    const { stories } = this.state;
    const { sessionStart } = this.state;
    const username = this.user === null || this.user === undefined ? undefined : this.props.user?.username;
    this.setState({
      loading: true
    });

    try {

      //get stories from backend
      axios.get(url + 'stories', {
        params: {
          time: sessionStart,
          type: 'storysave',
          filter: this.search == '' || this.search == null || this.search == undefined ? null : this.search,
          username: username,
          page: page
        }
      })
        .then(response => {
          this.setState({
            stories:
              page === 1
                ? Array.from(response.data.stories === undefined ? [] : response.data.stories)
                : response.data.stories === undefined ? this.state.stories : [...this.state.stories, ...response.data.stories],
          }

          );
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {

    } finally {
      this.setState({
        loading: false
      });


    }
  }


  loadMore = async () => {
    if (!this.state.loading) {
      this.setState(
        (prevState: any) => ({
          page: prevState.page + 1,
        }),
        () => {
          this.fetchStories();
        }
      );
    }
  };


  refresh = async () => {
    this.setState(
      {
        page: 1,
        stories: [],
        sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
      }
      ,
      () => {
        this.fetchStories();
      }
    );
  };
  Header = () => {
    return (<View style={styles.storySaveHeader}>
      <View style={{ flex: 0.4 }}>
        <ImageBackground
          style={styles.topImage}
          source={storySaveSplash}
        />
      </View>
      <View style={{ flex: 0.6 }}>
        <Text style={styles.storySaveTitle}>{this.context.t('storySaveCollection')}</Text>
      </View>
    </View>
    );
  }

  componentDidMount() {
    this.fetchStories()
  };
  renderItem = ({ item }) => <SavedStory story={item} user={this.user}/>;
  render() {
    const { stories } = this.state;
    return (

      <FlatList
        ListHeaderComponent={<this.Header></this.Header>}
        data={stories}
        ref={this.scrollRef}
        renderItem={this.renderItem}
        keyExtractor={item => item.id.toString()}
        refreshing={this.state.loading}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.5}
      />
    )
  };

}
