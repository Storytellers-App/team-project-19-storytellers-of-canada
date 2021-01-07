import React from "react";
import { UserType } from './types';
export type UserContextType = {
  user: undefined | UserType,
  setUser: (user: UserType | undefined) => void,
}
const context = {
  user: undefined,
  setUser: (user: UserType | undefined) => {},
}

export const UserContext = React.createContext<UserContextType>(context);