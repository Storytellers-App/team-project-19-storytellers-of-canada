import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import * as Config from '../../config';
import { CommentType, ResponseType, StorySaveType, UserStoryType, UserType } from "../../types";
import Comment from '../Comment';
import SavedStory from '../SavedStory';
import UserStory from '../UserStory';

let url = Config.HOST

type Props = {
    user: UserType | undefined | null;
}
type State = {
    posts: ResponseType[],
    page: number,
    loading: boolean,
    sessionStart: string
};

export default class AdminFeed extends Component<Props, State> {
    private user: UserType | null | undefined;
    constructor(props: Props) {
        super(props);
        this.user = props.user;
        this.state = {
            posts: [] as ResponseType[],
            page: 1,
            loading: true,
            sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        };
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
                                : response.data.posts === undefined ? this.state.posts : [...this.state.posts, ...response.data.posts],
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


    Response = ({ response }: { response: ResponseType }) => {
        if ((response as StorySaveType).author) {
            return <SavedStory story={response as StorySaveType} admin={true} user={this.user}></SavedStory>;
        }
        else if ((response as CommentType).comment) {
            return (
                <Comment comment={response as CommentType} admin={true} user={this.user}></Comment>
            );
        }
        else {
            return (
                <UserStory story={response as UserStoryType} admin={true} user={this.user}></UserStory>
            );
        }
    }

    render() {
        const { posts } = this.state;
        return (

            <FlatList
                data={posts}
                renderItem={({ item }) => <this.Response response={item} />}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={3}
            />
        )
    };

}
