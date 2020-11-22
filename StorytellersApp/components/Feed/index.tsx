import React, { Component, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native';

import userstories from '../../data/userstoriestest';
import UserStory from '../UserStory';
import { UserStoryType, UserType } from "../../types";
import axios from 'axios';
import moment from 'moment'

import * as Config from '../../config';

let url = Config.HOST //local ip address 

export default class Feed extends Component {

    state = {
        stories: [] as UserStoryType[],
        page: 1,
        loading: true,
        sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    };

    fetchStories = async () => {
        const { page } = this.state;
        const { stories } = this.state;
        const { sessionStart } = this.state;
        this.setState({
            loading: true
        });

        try {

            //get stories from backend
            // let story_arr = userstories as UserStoryType[];

            axios.get(url + 'stories', {
                params: {
                    time: sessionStart,
                    type: 'userstory',
                    page: page
                }
            })
                .then(response => {

                    this.setState({
                        stories:
                            page === 1
                                ? Array.from(response.data.stories === undefined ? [] : response.data.stories)
                                : [...this.state.stories, ...response.data.stories],
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
    componentDidMount() {
        this.fetchStories();
    };
    render() {
        const { stories } = this.state;
        return (

            <FlatList
                data={stories}
                renderItem={({ item }) => <UserStory story={item} />}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={3}
            />
        )
    };

}
