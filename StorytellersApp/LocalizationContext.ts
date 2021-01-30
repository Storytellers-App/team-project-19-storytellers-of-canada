import React from "react";
export type LocalizationContextType = {
  t: any,
}
const context = {
  t: undefined,
}

export const LocalizationContext = React.createContext<LocalizationContextType>(context);