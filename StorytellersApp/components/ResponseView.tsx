import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import * as Config from '../config';
import Colors from '../constants/Colors';
import { CommentType, ResponseType, StorySaveType, UserStoryType, UserType } from "../types";
import Comment from './Comment';
import SavedStory from './SavedStory';
import UserStory from './UserStory';



let url = Config.HOST //local ip address 


type Props = {
    response: ResponseType;
    user: UserType | null | undefined;
}
type State = {
    responses: ResponseType[],
    page: number,
    loading: boolean,
    sessionStart: string
};

export default class ResponseFeed extends Component<Props, State> {
    private cancelTokenSource: any;
    private user: UserType | null | undefined;
    constructor(props: Props) {
        super(props);
        this.user = props.user;
        this.state = {
            responses: [] as ResponseType[],
            page: 1,
            loading: true,
            sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        };
    };


    Header = ({ response: header, user: user }: Props) => {
        if ((header as StorySaveType).author) {
            return (
                <View>
                    <SavedStory story={header as StorySaveType} disableResponse={true} user={user}></SavedStory>
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
                    <Comment comment={header as CommentType} disableResponse={true} user={user}></Comment>
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
                <UserStory story={header as UserStoryType} disableResponse={true} user={user}></UserStory>
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

    Response = ({ response, user }: Props) => {
        if ((response as StorySaveType).author) {
            return <SavedStory story={response as StorySaveType} user={user}></SavedStory>;
        }
        else if ((response as CommentType).comment) {
            return (
                <Comment comment={response as CommentType} user={user}></Comment>
            );
        }
        else {
            return (
                <UserStory story={response as UserStoryType} user={user}></UserStory>
            );
        }
    }


    
    fetchStories = async () => {
        const { page } = this.state;
        const { responses } = this.state;
        const { sessionStart } = this.state;
        const username = this.user === null || this.user === undefined ? undefined : this.props.user?.username;
        this.setState({
            loading: true
        });

        try {

            //get stories from backend
            // let story_arr = userstories as UserStoryType[];

            axios.get(url + 'stories/responses', {
                cancelToken: this.cancelTokenSource.token,
                params: {
                    id: this.props.response.id,
                    time: sessionStart,
                    username: username,
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
                    if (axios.isCancel(error)){
                        return;
                    }
                    else{
                        console.error(error);
                    }
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
                responses: [],
                sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
            }
            ,
            () => {
                this.fetchStories();
            }
        );
    };


    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source();
        this.fetchStories();
    };

    componentWillUnmount(){
        this.cancelTokenSource.cancel();
    }
    render() {
        const { responses } = this.state;
        return (

            <FlatList
                ListHeaderComponent={<this.Header response={this.props.response} user={this.props.user} ></this.Header>}
                data={responses}
                renderItem={({ item }) => <this.Response response={item} user={this.props.user}/>}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
            />
        )
    };

}
