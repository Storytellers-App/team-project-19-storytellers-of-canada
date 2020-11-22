import React, { Component, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native';

import userstories from '../../data/userstoriestest';
import UserStory from '../UserStory';
import { UserStoryType, UserType, StoryType, StorySaveType } from "../../types";
import axios from 'axios';
import moment from 'moment';
import {
    Text,
} from 'react-native-paper';


import * as Config from '../../config';

let url = Config.HOST //local ip address 

type Props = {
    story: StoryType;
}

export default class AdminFeed extends Component {

    state = {
        posts: [] as StoryType[],
        page: 1,
        loading: true,
        sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    };

    fetchStories = async () => {
        const { page } = this.state;
        const { posts } = this.state;
        const { sessionStart } = this.state;
        this.setState({
            loading: true
        });

        try {

            axios.get(url + 'admin', {
                params: {
                    time: sessionStart,
                    page: page
                }
            })
                .then(response => {

                    this.setState({
                        posts:
                            page === 1
                                ? Array.from(response.data.posts === undefined ? [] : response.data.posts)
                                : [...this.state.posts, ...response.data.posts],
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
                posts: [],
                sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
            }
            ,
            () => {
                this.fetchStories();
            }
        );
    };
    componentDidMount() {
        this.fetchStories();
    };

    Story = ({ story }: Props) => {
        if ((story as StorySaveType).author) {
            return <Text>Testing stored story</Text>;
        }
        else {
            return (
                <UserStory story={story as UserStoryType} admin={true}></UserStory>
            );
        }
    }

    render() {
        const { posts } = this.state;
        return (

            <FlatList
                data={posts}
                renderItem={({ item }) => <this.Story story={item} />}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={3}
            />
        )
    };

}
