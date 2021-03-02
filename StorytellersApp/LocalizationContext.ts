import React from "react";
export type LocalizationContextType = {
  t: any,
  locale: any,
  setLocale: any,
}
const context = {
  t: undefined,
  locale: undefined,
  setLocale: undefined,
}

export const LocalizationContext = React.createContext<LocalizationContextType>(context);