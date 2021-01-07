import React from "react";
import { UserType } from './types';
export type UserContextType = {
  user: undefined | UserType,
  setUser: (user: UserType) => void,
}
const context = {
  user: undefined,
  setUser: (user: UserType) => {},
}

export const UserContext = React.createContext<UserContextType>(context);