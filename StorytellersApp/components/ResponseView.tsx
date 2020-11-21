import React, { Component, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
} from 'react-native-paper';
import UserStory from './UserStory';
import { UserStoryType, UserType, StoryType, RootStackParamList, StorySaveType } from "../types";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment'

let url = "" //local ip address 

type StoryDetailsRouteProp = RouteProp<RootStackParamList, 'StoryResponse'>;

type StoryDetailsNavigationProp = StackNavigationProp<
    RootStackParamList,
    'StoryResponse'
>;
type Props = {
    route: StoryDetailsRouteProp;
    navigation: StoryDetailsNavigationProp;
}

export default class ResponseFeed extends Component<Props> {

    state = {
        responses: [] as StoryType[],
        page: 1,
        loading: true,
        sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    };


    Story = ({ route, navigation }: Props) => {
        const story = route.params.story
        if ((story as StorySaveType).author) {
            return <Text>Testing stored story</Text>;
        }
        else {
            return <UserStory story={route.params.story as UserStoryType}></UserStory>;
        }
    }



    fetchStories = async () => {
        const { page } = this.state;
        const { responses } = this.state;
        const { sessionStart } = this.state;
        console.log(sessionStart);
        this.setState({
            loading: true
        });

        try {

            //get stories from backend
            // let story_arr = userstories as UserStoryType[];
           
            axios.get(url + 'stories/responses', {
                params: {
                    id: this.props.route.params.story.id,
                    time: sessionStart,
                    page: page
                }
            })
                .then(response => {
                    this.setState({
                        responses:
                            page === 1
                                ? Array.from(response.data.responses)
                                : [...this.state.responses, ...response.data.responses],
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
        const { responses } = this.state;
        return (

            <FlatList
                ListHeaderComponent={<this.Story route={this.props.route} navigation={this.props.navigation}></this.Story>}
                data={responses}
                renderItem={({ item }) => <UserStory story={item as UserStoryType} />}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
            />
        )
    };

}
