import React from "react";
import {currentStory, ResponseType} from './types';
const context = {
  story: null,
  fullStoryType: null,
  position: null,
  isPlaying: null,
  isSeekingComplete: null,
  isRadioPlaying: null,
  setStory: (newStory: currentStory) => {},
  setPosition: (newPosition: number) => {},
  setIsPlaying: (isPlaying : boolean) => {},
  setIsSeekingComplete: (isSeekingComplete : boolean) => {},
  setIsRadioPlaying: (isRadioPlaying: boolean ) => {},
  setFullStoryType: (fullStory: ResponseType) => {},
}

export const AppContext = React.createContext(context);