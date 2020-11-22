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
  AdminPanelScreen: undefined;
};

export type HomeNavigatorParamList = {
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type AdminPanelParamList = {
    AdminPanelScreen: undefined;
};

export type RadioPlayerParamList = {
  RadioPlayer: undefined;
}

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
  numReplies?: number,
  numLikes?: number,
  tags: string[],
  type: string,
}

export type UserStoryType = {
  id: number,
  creationTime: string,
  title: string,
  description: string,
  recording: string,
  numLikes?: number,
  numReplies?: number,
  user: UserType,
  parent?: UserStoryType,
  approved: boolean,
  tags: string[],
  type: string,
};

export type StoryType = UserStoryType | StorySaveType;



