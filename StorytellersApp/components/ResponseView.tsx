import React, { Component, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
    Appbar,
} from 'react-native-paper';
import UserStory from './UserStory';
import Comment from './Comment';
import SavedStory from './SavedStory';
import { UserStoryType, UserType, StoryType, ResponseType, RootStackParamList, StorySaveType, CommentType } from "../types";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment'
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-community/async-storage';


import * as Config from '../config';

let url = Config.HOST //local ip address 


type Props = {
    response: ResponseType;
}

export default class ResponseFeed extends Component<Props> {

    state = {
        responses: [] as StoryType[],
        page: 1,
        user: null,
        loading: true,
        sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    };


    Header = ({ response: header }: Props) => {
        if ((header as StorySaveType).author) {
            return (
                <View>
                    <SavedStory story={header as StorySaveType} disableResponse={true}></SavedStory>
                    <View
                        style={{
                            borderBottomColor: Colors.light.tint,
                            borderBottomWidth: 2,
                            marginVertical: 10,
                        }}
                    />
                </View>
            );
        }
        else if ((header as CommentType).comment) {
            return (
                <View>
                    <Comment comment={header as CommentType} disableResponse={true}></Comment>
                    <View
                        style={{
                            borderBottomColor: Colors.light.tint,
                            borderBottomWidth: 2,
                            marginVertical: 10,
                        }}
                    />
                </View>
            );
        }
        else {
            // Temporary styling to distinguish header story from replies
            return (<View>
                <UserStory story={header as UserStoryType} disableResponse={true}></UserStory>
                <View
                    style={{
                        borderBottomColor: Colors.light.tint,
                        borderBottomWidth: 2,
                        marginVertical: 10,
                    }}
                />
            </View>
            );
        }
    }

    Response = ({ response }: Props) => {
        if ((response as StorySaveType).author) {
            return <SavedStory story={response as StorySaveType}></SavedStory>;
        }
        else if ((response as CommentType).comment) {
            return (
                <Comment comment={response as CommentType}></Comment>
            );
        }
        else {
            return (
                <UserStory story={response as UserStoryType}></UserStory>
            );
        }
    }



    fetchStories = async () => {
        const { page } = this.state;
        const { responses } = this.state;
        const { sessionStart } = this.state;
        const { user } = this.state;
        this.setState({
            loading: true
        });

        try {

            //get stories from backend
            // let story_arr = userstories as UserStoryType[];

            axios.get(url + 'stories/responses', {
                params: {
                    id: this.props.response.id,
                    time: sessionStart,
                    username: user,
                    type: this.props.response.type,
                    page: page
                }
            })
                .then(response => {

                    this.setState({
                        responses:
                            page === 1
                                ? Array.from(response.data.responses === undefined ? [] : response.data.responses)
                                : response.data.responses === undefined ? this.state.responses : [...this.state.responses, ...response.data.responses],
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

    getUserandFetch = async () => {
        const currentUser = await AsyncStorage.getItem("username");
        this.setState({ user: currentUser },
            () => { this.fetchStories() })
    };

    componentDidMount() {
        this.getUserandFetch()
    };

    render() {
        const { responses } = this.state;
        return (

            <FlatList
                ListHeaderComponent={<this.Header response={this.props.response}></this.Header>}
                data={responses}
                renderItem={({ item }) => <this.Response response={item} />}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
            />
        )
    };

}
