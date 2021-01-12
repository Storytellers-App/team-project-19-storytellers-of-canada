
export type RootStackParamList = {
  Root: undefined;
  StoryResponse: {
    header: ResponseType;
  };
  NewComment: {
    parent?: ResponseType,
    user: UserType,
  };
  NotFound: undefined;
  NewRecording: { parent?: ResponseType, user: UserType};
  NewStory: { recording: string | null, user: UserType, parent?: ResponseType };
};


export type BottomTabParamList = {
  Home: undefined;
  StoredStories: undefined;
  AdminPanelScreen: undefined;
  RadioPlayer: undefined;
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
  email: string,
  authToken: string,
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
  parent?: ResponseType,
  parentType?: string,
  tags: string[],
  type: string,
  image?: string,
  isLiked?: boolean,
  user: UserType,
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
  parentType?: string,
  approved: boolean,
  tags: string[],
  type: string,
  image?: string,
  isLiked?: boolean,
};

export type CommentType = {
  id: number,
  creationTime: string,
  numLikes?: number,
  numReplies?: number,
  user: UserType,
  parentType?: string,
  parent?: UserStoryType,
  approved: boolean,
  type: string,
  comment: string,
  isLiked?: boolean,
};

export type StoryType = UserStoryType | StorySaveType;

export type ResponseType = StoryType | CommentType;

export type currentStory = {
  id: string | null,
  recording: string | null,
  title: string | null,
  image?: string | null,
  creator: string | null,
  isLiked?: boolean,
}


