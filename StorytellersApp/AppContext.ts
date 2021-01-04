import React from "react";
import {currentStory} from './types';
const context = {
  story: null,
  position: null,
  isPlaying: null,
  isSeekingComplete: null,
  setStory: (newStory: currentStory) => {},
  setPosition: (newPosition: number) => {},
  setIsPlaying: (isPlaying : boolean) => {},
  setIsSeekingComplete: (isSeekingComplete : boolean) => {},
}

export const AppContext = React.createContext(context);