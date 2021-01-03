import React from "react";
import {currentStory} from './types';
const context = {
  story: null,
  position: null,
  isPlaying: null,
  setStory: (newStory: currentStory) => {},
  setPosition: (newPosition: number) => {},
  setIsPlaying: (isPlaying : boolean) => {},
}

export const AppContext = React.createContext(context);