import { UserStoryProps } from "./components/UserStory";

export type RootStackParamList = {
  Root: undefined;
  StoryResponse: {
    story: StoryType;
  };
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  StoredStories: undefined;
};

export type HomeNavigatorParamList = {
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type UserType = {
  username: string,
  name: string,
  type: string,
  image?: string,
}
export type StorySaveType = {
  id: number,
  creationTime: string,
  title: string,
  description: string,
  author: string,
  recording: string,
  numberOfReplies?: number,
  numberOfLikes?: number,
}

export type UserStoryType = {
  id: number,
  creationTime: string,
  title: string,
  description: string,
  recording: string,
  numberOfReplies?: number,
  numberOfLikes?: number,
  user: UserType,
  parent?: UserStoryType,
  approved: boolean,
};

export type StoryType = UserStoryType | StorySaveType;



