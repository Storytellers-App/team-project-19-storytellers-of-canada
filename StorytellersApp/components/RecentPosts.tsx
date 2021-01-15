import React, { Component, useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import UserStory from "./UserStory";
import { UserStoryType, UserType } from "../types";
import axios from "axios";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import { Card } from "react-native-paper";

import * as Config from "../config";

let url = Config.HOST; //local ip address
type Props = {
  key: string;
  search: string;
};
type State = {
  stories: UserStoryType[];
  user: string | null;
  page: number;
  loading: boolean;
  sessionStart: string;
};

export default class RecentPosts extends Component<Props, State> {
  private search: string;
  constructor(props: Props) {
    super(props);
    this.search = props.search;
    this.state = {
      stories: [] as UserStoryType[],
      user: null,
      page: 1,
      loading: true,
      sessionStart: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  fetchStories = async () => {
    const { page } = this.state;
    const { stories } = this.state;
    const { sessionStart } = this.state;
    const { user } = this.state;

    this.setState({
      loading: true,
    });

    try {
      //get stories from backend
      // let story_arr = userstories as UserStoryType[];

      axios
        .get(url + "stories", {
          params: {
            time: sessionStart,
            type: "userstory",
            filter:
              this.search == "" ||
              this.search == null ||
              this.search == undefined
                ? null
                : this.search,
            username: user,
            page: page,
          },
        })
        .then((response) => {
          this.setState({
            stories:
              page === 1
                ? Array.from(
                    response.data.stories === undefined
                      ? []
                      : response.data.stories
                  )
                : response.data.stories === undefined
                ? this.state.stories
                : [...this.state.stories, ...response.data.stories],
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

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
        sessionStart: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      },
      () => {
        this.fetchStories();
      }
    );
  };

  getUserandFetch = async () => {
    const currentUser = await AsyncStorage.getItem("username");
    this.setState({ user: currentUser }, () => {
      this.fetchStories();
    });
  };

  componentDidMount() {
    this.getUserandFetch();
  }
  render() {
    const { stories } = this.state;
    let myStories: any[] = [];
    for (let story of stories) {
      if (story.user.username == this.state.user) {
        myStories.push(story);
        if (myStories.length >= 3) {
          break;
        }
      }
    }

    const Item = ({ item }) => (
      <View>
        <Card style={{ backgroundColor: "lightgreen", borderWidth: 2 }}>
          <Card.Title title="Your Post Was Approved!"></Card.Title>
          <Card.Content>
            <Text>Post Title: {item.title}</Text>
            <Text>{moment(item.creationTime).fromNow()}</Text>
          </Card.Content>
        </Card>
        <Text></Text>
      </View>
    );
    const renderItem = ({ item }) => <Item item={item} />;
    return (
      <FlatList
        data={myStories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={this.state.loading}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.5}
      />
    );
  }
}
