import React from "react";
import {currentStory, ResponseType} from './types';
export type AppContextType = {
  story: null | currentStory,
  fullStoryType: null | ResponseType,
  position: null | number,
  isPlaying: null | boolean,
  isSeekingComplete: null | boolean,
  isRadioPlaying: null | boolean,
  setStory: (newStory: currentStory) => void,
  setPosition: (newPosition: number) => void,
  setIsPlaying: (isPlaying : boolean) => void,
  setIsSeekingComplete: (isSeekingComplete : boolean) => void,
  setIsRadioPlaying: (isRadioPlaying: boolean ) => void,
  setFullStoryType: (fullStory: ResponseType) => void,
}
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

export const AppContext = React.createContext<AppContextType>(context);